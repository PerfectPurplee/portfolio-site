import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as dat from "dat.gui";
import CannonDebugger from "cannon-es-debugger";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Box, Car, Billboard} from "../utils/assetloader.js";
import {ThirdPersonCamera} from "../utils/ThirdPersonCamera.js";
import {gsap} from "gsap";
import {DatGui} from "../utils/datGui.js";
import eventListenersBuilder from "../utils/listeners.js";
import {RayCasterHandler} from "../utils/rayCasterHandler.js";
import {CameraHandler} from "../utils/cameraHandler.js";
import {Vector2} from "three";


export class ApplicationEngine {


    constructor() {
        this.userInteracting = {value: false};
        this.cameraCurrentLookAt = null

        this._initGraphicsWorld();
        this._initPhysicsWorld();
        this.setCannonEntities();
        this.setThreeEntities();
        this.totalWheelRotationApplied = 0;
        this.maxWheelRotation = Math.PI / 8;
        this.datGui = new DatGui(this)
        this.cameraHandler = new CameraHandler(this.camera, this.userInteracting, this.cameraCurrentLookAt)
        this.rayCasterHandler = new RayCasterHandler(this.cameraHandler, this.camera,
            this.scene, this.listOfBillboards, this.userInteracting, this.listOFSpotLights)
        this.createCanvasRectangleMesh()

        // Button interactions
        this.welcomeButton = document.getElementById("welcomeButton")
        this.welcomeButton.addEventListener("click", this.removeWelcomeScreen)

        // utils
        this.animationFinished = false;
        this.justEnteredTheZone = true
        // eventListener setup
        this.eventHandler = eventListenersBuilder()
        this.eventHandler.setOnPointerMoveListener(this.rayCasterHandler.pointerMove)
        this.eventHandler.setOnPointerClickListener(this.rayCasterHandler)
        this.eventHandler.setKeyUPEventListener()
        this.eventHandler.setKeyDownEventListener()
        this.eventHandler.setResizeEventListener(this.camera, this.renderer)

        // starts game loop
        this.update();
    }

    update = () => {
        requestAnimationFrame(this.update)

        // Physics Update
        this.physicsWorld.fixedStep();
        // if (this.cannonDebugger)
        //     this.cannonDebugger.update();

        const maxSteerVal = Math.PI / 8;
        const maxForce = 50;

        if (this.carMesh.carModel && this.carBody) {
            if (this.eventHandler.moveForward) {
                this.vehicle.setWheelForce(-maxForce, 0)
                this.vehicle.setWheelForce(-maxForce, 1)
                this.carMesh.frontLeftWheel.rotation.z -= 0.03
                this.carMesh.frontRightWheel.rotation.z += 0.03
                this.carMesh.backLeftWheel.rotation.z -= 0.03
                this.carMesh.backRightWheel.rotation.z += 0.03
            }
            if (this.eventHandler.moveBackward) {
                this.vehicle.setWheelForce(maxForce / 2, 0)
                this.vehicle.setWheelForce(maxForce / 2, 1)
                this.carMesh.frontLeftWheel.rotation.z += 0.03
                this.carMesh.frontRightWheel.rotation.z -= 0.03
                this.carMesh.backLeftWheel.rotation.z += 0.03
                this.carMesh.backRightWheel.rotation.z -= 0.03
            }
            if (this.eventHandler.moveLeft) {
                this.vehicle.setSteeringValue(maxSteerVal, 0)
                this.vehicle.setSteeringValue(maxSteerVal, 1)

                if (this.totalWheelRotationApplied > -this.maxWheelRotation) {
                    this.totalWheelRotationApplied -= 0.03
                    this.carMesh.frontLeftWheel.rotation.y += 0.03;
                    this.carMesh.frontRightWheel.rotation.y -= 0.03;
                }
            }

            if (this.eventHandler.moveRight) {
                this.vehicle.setSteeringValue(-maxSteerVal, 0)
                this.vehicle.setSteeringValue(-maxSteerVal, 1)

                if (this.totalWheelRotationApplied < this.maxWheelRotation) {
                    this.totalWheelRotationApplied += 0.03
                    this.carMesh.frontLeftWheel.rotation.y -= 0.03
                    this.carMesh.frontRightWheel.rotation.y += 0.03
                }
            }
            if (!this.eventHandler.moveForward && !this.eventHandler.moveBackward) {
                this.vehicle.setWheelForce(0, 0)
                this.vehicle.setWheelForce(0, 1)
            }
            if (!this.eventHandler.moveLeft && !this.eventHandler.moveRight) {
                this.vehicle.setSteeringValue(0, 0)
                this.vehicle.setSteeringValue(0, 1)
                this.totalWheelRotationApplied = 0;
                this.carMesh.frontLeftWheel.rotation.y = 0;
                this.carMesh.frontRightWheel.rotation.y = 0;

            }
            // Check for deceleration while in a zone

            if (this.isCarInsideBox() && this.justEnteredTheZone) {
                gsap.to(this.carBody.velocity, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,

                    onComplete: () => {
                        this.userInteracting.value = true
                        this.cameraHandler.cameraLookAtHandler(this.billboard02.billboardModel)

                    }
                })
                this.justEnteredTheZone = false
                // this.carBody.angularVelocity.set(0,0,0)
            }


            // Graphics Update
            this.renderer.render(this.scene, this.camera)
            // this.orbitControls.update();
            // this._thirdPersonCamera.updateCamera();
            if (this.carMesh.carModel && this.carBody) {
                this.carMesh.carModel.scene.position.x = this.carBody.position.x
                this.carMesh.carModel.scene.position.y = this.carBody.position.y - 0.1
                this.carMesh.carModel.scene.position.z = this.carBody.position.z

                this.carMesh.carModel.scene.quaternion.copy(this.carBody.quaternion)
            }

            // Raycaster spotlight handler
            this.rayCasterHandler.handleRayCasterPointerMove()


            //     camera update
            if (!document.contains(document.getElementById('welcomeScreen')) && this.animationFinished && !this.userInteracting.value) {

                this.camera.position.x = (this.carBody.position.x - 8);
                this.camera.position.y = (this.carBody.position.y + 6);
                this.camera.position.z = (this.carBody.position.z);

                // this.orbitControls.target.copy(this.carBody.position)

            }
            if (!this.userInteracting.value) {
                this.camera.lookAt(this.carBody.position.x + 10, this.carBody.position.y, this.carBody.position.z)
                this.cameraCurrentLookAt = {
                    x: this.carBody.position.x + 10,
                    y: this.carBody.position.y,
                    z: this.carBody.position.z
                }
                this.cameraHandler.setCurrentCameraLookAt(this.cameraCurrentLookAt)
            }
        }


    }
    setCannonEntities = () => {
        // CANNON entities initialization

        // Car Body
        const radius = 1;
        this.carBody = new CANNON.Body({
            mass: 30,
            position: new CANNON.Vec3(-10, 0.5, 0), shape: new CANNON.Box(new CANNON.Vec3(1, 0.3, 1.5))
        });


        this.vehicle = new CANNON.RigidVehicle({
            chassisBody: this.carBody
        })


        // Wheels
        const mass = 1;
        const axisWidth = 3;
        const wheelShape = new CANNON.Sphere(0.5);
        const wheelMaterial = new CANNON.Material('wheel');
        const down = new CANNON.Vec3(0, -1, 0);

        this.wheelBody1 = new CANNON.Body({
            mass, material: wheelMaterial
        });
        this.wheelBody1.addShape(wheelShape)
        this.wheelBody1.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody1,
            position: new CANNON.Vec3(2, 0, axisWidth / 2),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: down,
        });

        this.wheelBody2 = new CANNON.Body({
            mass, material: wheelMaterial
        });
        this.wheelBody2.addShape(wheelShape)
        this.wheelBody2.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody2,
            position: new CANNON.Vec3(2, 0, -axisWidth / 2),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: down
        });

        this.wheelBody3 = new CANNON.Body({
            mass, material: wheelMaterial
        });
        this.wheelBody3.addShape(wheelShape)
        this.wheelBody3.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody3,
            position: new CANNON.Vec3(-2, 0, axisWidth / 2),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: down
        });

        this.wheelBody4 = new CANNON.Body({
            mass, material: wheelMaterial
        });
        this.wheelBody4.addShape(wheelShape)
        this.wheelBody4.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: this.wheelBody4,
            position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: down
        });

        this.vehicle.addToWorld(this.physicsWorld)
    }
    setThreeEntities = () => {
        // THREE entities initialization
        this.groundGeometry = new THREE.PlaneGeometry(1000, 1000)
        this.groundMesh = new THREE.MeshPhongMaterial({
            color: 0xdbd9d3, shininess: 100
        })
        this.ground = new THREE.Mesh(this.groundGeometry, this.groundMesh)
        this.ground.receiveShadow = true
        this.ground.position.copy(this.groundBody.position)
        this.ground.quaternion.copy(this.groundBody.quaternion)

        // car model initialization
        this.carMesh = new Car(this.scene, this.carBody)


        // billboard model init
        this.listOfBillboards = [
            this.billboard01 = new Billboard(this.scene, {
                    x: 27,
                    y: 0,
                    z: -28
                },
                -1,
                "billboard1"
            ),
            this.billboard02 = new Billboard(this.scene,
                {
                    x: 40,
                    y: 0,
                    z: -16.5,
                },
                -1.58,
                "billboard2"
            ),
            this.billboard03 = new Billboard(this.scene, {
                    x: 45,
                    y: 0,
                    z: 0.5
                },
                -2.3,
                "billboard3"
            )
        ]

        // terrain


        this.scene.add(this.ground)
        this.scene.add(this.ambientLight);
        this.scene.add(this.light)
        this.scene.add(this.spotLight1)
        this.scene.add(this.spotLight1.target)
        this.scene.add(this.spotLight2)
        this.scene.add(this.spotLight2.target)
        this.scene.add(this.spotLight3)
        this.scene.add(this.spotLight3.target)
        // this.scene.add(this.spotLightHelper1)
    }
    createEntity = (width, height, depth, color) => {
        return new Box(width, height, depth, color)
    }
    _initGraphicsWorld = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this.camera,
        })


        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x000000);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(innerWidth, innerHeight)
        document.body.appendChild(this.renderer.domElement)

        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        // this.orbitControls.addEventListener('start', () => {
        //     this.userInteracting = true;
        // });
        //
        // this.orbitControls.addEventListener('end', () => {
        //     this.userInteracting = false;
        // });

        this.light = new THREE.DirectionalLight(0xffffff, 2)
        this.light.position.set(3, 1000, 30);
        this.light.target = (this.scene);
        this.light.shadow.radius = 4;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 1000;
        this.light.shadow.camera.left = -100;
        this.light.shadow.camera.right = 100;
        this.light.shadow.camera.top = 100;
        this.light.shadow.camera.bottom = -100;
        this.light.shadow.bias = -0.002;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.castShadow = true;
        this.camera.position.x = -1;
        this.camera.position.y = 27;
        this.camera.position.z = 0;


        this.spotLight1 = new THREE.SpotLight(0xFFFFFF, 75, 25.0, 0.79, 1, 2)
        this.spotLight1.position.set(35, 16, -16)
        this.spotLight1.target.position.set(41, -13, -14)
        this.spotLightHelper1 = new THREE.SpotLightHelper(this.spotLight1)

        this.spotLight2 = new THREE.SpotLight(0xFFFFFF, 75, 25.0, 0.79, 1, 2)
        this.spotLight2.position.set(41, 16, 0)
        this.spotLight2.target.position.set(34, -13, 0)

        this.spotLight3 = new THREE.SpotLight(0xFFFFFF, 75, 25.0, 0.79, 1, 2)
        this.spotLight3.position.set(34, 17, 15)
        this.spotLight3.target.position.set(41, -13, 18)

        this.listOFSpotLights = [
            this.spotLight1,
            this.spotLight2,
            this.spotLight3
        ]

        this.ambientLight = new THREE.AmbientLight(0xffffff);
    }
    _initPhysicsWorld = () => {
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0)
        })

        // Ground
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC, shape: new CANNON.Plane()
        })
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(this.groundBody);

        this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, {});

    }
    // updateCameraPos = () => {
    //     this.camera.position.x = this.datGui.cameraGui.position.x
    //     this.camera.position.y = this.datGui.cameraGui.position.y
    //     this.camera.position.z = this.datGui.cameraGui.position.z
    // }
    updateBillboardPos = (billboard, billboardGui) => {
        if (billboard) {
            billboard.billboardModel.scene.position.set(
                billboardGui.position.x,
                billboardGui.position.y,
                billboardGui.position.z
            );
            billboard.billboardModel.scene.rotation.y = billboardGui.position.rotation
        }
    }
    updateAllBillboardsPositions = () => {
        this.updateBillboardPos(this.billboard01, this.datGui.billboard1Gui)
        this.updateBillboardPos(this.billboard02, this.datGui.billboard2Gui)
        this.updateBillboardPos(this.billboard03, this.datGui.billboard3Gui)
    }
    removeWelcomeScreen = () => {
        const divToRemove = document.getElementById("welcomeScreen")
        if (divToRemove) {
            divToRemove.remove()
            this.changeCameraPositionAfterWelcomeScreen()
        }
    }
    changeCameraPositionAfterWelcomeScreen = () => {
        gsap.to(this.camera.position, {

            x: this.carBody.position.x - 8,
            y: this.carBody.position.y + 6,
            z: this.carBody.position.z,
            duration: 3,


            onUpdate: () => {

                this.camera.updateProjectionMatrix()
            },
            onComplete: () => {
                this.animationFinished = true;

            }

        })

    }

    createCanvasRectangleMesh() {
        // Set the size and position of the rectangle
        const rectWidth = 15
        const rectHeight = 33
        const rectPosition = new THREE.Vector3(20, 0.01, 0)
        const lineWidth = 1

// Create a canvas and draw the rectangle on it
        const canvas = document.createElement('canvas')
        canvas.width = rectWidth
        canvas.height = rectHeight
        const context = canvas.getContext('2d')
        context.strokeStyle = 'white'; // Set the rectangle color
        context.lineWidth = lineWidth;
        context.strokeRect(0, 0, rectWidth, rectHeight);

        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(rectWidth, rectHeight);
        const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide, transparent: true});
        this.rectangleMesh = new THREE.Mesh(geometry, material);
        this.rectangleMesh.position.copy(rectPosition)
        this.rectangleMesh.rotation.x = -Math.PI / 2
        this.rectangleMesh.geometry.computeBoundingBox()
        this.box = new THREE.Box2(
            new THREE.Vector2(rectPosition.x - rectWidth / 2, rectPosition.z - rectHeight / 2), // Bottom-left corner
            new THREE.Vector2(rectPosition.x + rectWidth / 2, rectPosition.z + rectHeight / 2)  // Top-right corner
        );

        this.scene.add(this.rectangleMesh);
    }

    isCarInsideBox() {
        if (!this.box.containsPoint(new THREE.Vector2(this.carBody.position.x - 4, this.carBody.position.z))) {
            this.justEnteredTheZone = true
        }
        return this.box.containsPoint(new THREE.Vector2(this.carBody.position.x - 4, this.carBody.position.z))
    }

    listObjectsInScene() {
        // Iterate through the scene's children array
        this.scene.children.forEach((object, index) => {
            console.log(`Object ${index + 1}:`, object);
        });

    }
}



