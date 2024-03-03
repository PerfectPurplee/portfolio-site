import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as dat from "dat.gui";
import CannonDebugger from "cannon-es-debugger";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Box, Car, Billboard, Rocks, StoneFloor} from "./Entities/entities.js";
import {Eventlisteners} from "./Entities/eventlistener.js";
import {gsap} from "gsap";


export class Application {
    animationFinished;

    constructor() {
        this._initGraphicsWorld();
        this._initPhysicsWorld();

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

        // THREE entities initialization
        this.groundGeometry = new THREE.PlaneGeometry(1000, 1000)
        this.groundMesh = new THREE.MeshPhongMaterial({
            color: 0xe3d68d, shininess: 100
        })
        this.ground = new THREE.Mesh(this.groundGeometry, this.groundMesh)
        this.ground.receiveShadow = true
        this.ground.position.copy(this.groundBody.position)
        this.ground.quaternion.copy(this.groundBody.quaternion)

        // car model initialization
        this.carMesh = new Car(this.scene, this.carBody)


        // billboard model init
        this.billboard01 = new Billboard(this.scene, {
            x: 30,
            y: 0,
            z: 5

        })
        this.billboard02 = new Billboard(this.scene, {
            x: 50,
            y: 0,
            z: 5

        })
        this.billboard03 = new Billboard(this.scene, {
            x: 70,
            y: 0,
            z: 5
        })

        // terrain


        this.scene.add(this.ground)
        this.scene.add(this.ambientLight);
        this.scene.add(this.light)

        this.eventListener = new Eventlisteners(this.vehicle);

        this.totalWheelRotationApplied = 0;
        this.maxWheelRotation = Math.PI / 8;

        // Button interactions

        this.welcomeButton = document.getElementById("welcomeButton")
        this.welcomeButton.addEventListener("click", this.removeWelcomeScreen)
        this._initTerrainAfterWelcomeScreen()
        //
        // camera utils
        this.animationFinished = false;

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
            if (this.eventListener.moveForward) {
                this.vehicle.setWheelForce(-maxForce, 0)
                this.vehicle.setWheelForce(-maxForce, 1)
                this.carMesh.frontLeftWheel.rotation.z -= 0.03
                this.carMesh.frontRightWheel.rotation.z += 0.03
                this.carMesh.backLeftWheel.rotation.z -= 0.03
                this.carMesh.backRightWheel.rotation.z += 0.03
            }
            if (this.eventListener.moveBackward) {
                this.vehicle.setWheelForce(maxForce / 2, 0)
                this.vehicle.setWheelForce(maxForce / 2, 1)
                this.carMesh.frontLeftWheel.rotation.z += 0.03
                this.carMesh.frontRightWheel.rotation.z -= 0.03
                this.carMesh.backLeftWheel.rotation.z += 0.03
                this.carMesh.backRightWheel.rotation.z -= 0.03
            }
            if (this.eventListener.moveLeft) {
                this.vehicle.setSteeringValue(maxSteerVal, 0)
                this.vehicle.setSteeringValue(maxSteerVal, 1)

                if (this.totalWheelRotationApplied > -this.maxWheelRotation) {
                    this.totalWheelRotationApplied -= 0.03
                    this.carMesh.frontLeftWheel.rotation.y += 0.03;
                    this.carMesh.frontRightWheel.rotation.y -= 0.03;
                }
            }

            if (this.eventListener.moveRight) {
                this.vehicle.setSteeringValue(-maxSteerVal, 0)
                this.vehicle.setSteeringValue(-maxSteerVal, 1)

                if (this.totalWheelRotationApplied < this.maxWheelRotation) {
                    this.totalWheelRotationApplied += 0.03
                    this.carMesh.frontLeftWheel.rotation.y -= 0.03
                    this.carMesh.frontRightWheel.rotation.y += 0.03
                }
            }
            if (!this.eventListener.moveForward && !this.eventListener.moveBackward) {
                this.vehicle.setWheelForce(0, 0)
                this.vehicle.setWheelForce(0, 1)
            }
            if (!this.eventListener.moveLeft && !this.eventListener.moveRight) {
                this.vehicle.setSteeringValue(0, 0)
                this.vehicle.setSteeringValue(0, 1)
                this.totalWheelRotationApplied = 0;
                this.carMesh.frontLeftWheel.rotation.y = 0;
                this.carMesh.frontRightWheel.rotation.y = 0;

            }
            // Graphics Update
            this.renderer.render(this.scene, this.camera)
            this.orbitControls.update();
            // this._thirdPersonCamera.updateCamera();


            if (this.carMesh.carModel && this.carBody) {
                this.carMesh.carModel.scene.position.x = this.carBody.position.x
                this.carMesh.carModel.scene.position.y = this.carBody.position.y - 0.1
                this.carMesh.carModel.scene.position.z = this.carBody.position.z

                this.carMesh.carModel.scene.quaternion.copy(this.carBody.quaternion)
            }
            //     camera update


            if (!document.contains(document.getElementById('welcomeScreen')) && this.animationFinished && !this.userInteracting) {

                this.camera.position.x = (this.carBody.position.x - 7);
                this.camera.position.y = (this.carBody.position.y + 6);
                this.camera.position.z = (this.carBody.position.z - 5);

                this.orbitControls.target.copy(this.carBody.position)


            }
            if (!this.userInteracting)
                this.camera.lookAt(this.carBody.position.x + 10, this.carBody.position.y, this.carBody.position.z)
        }

    }

    createEntity = (width, height, depth, color) => {
        return new Box(width, height, depth, color)
    }

    _initGraphicsWorld = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
        this._thirdPersonCamera = new ThridPersonCamera({
            camera: this.camera,
        })


        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x000000);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(innerWidth, innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        this.orbitControls.addEventListener('start', () => {
            this.userInteracting = true;
        });

        this.orbitControls.addEventListener('end', () => {
            this.userInteracting = false;
        });


        this.light = new THREE.DirectionalLight(0xffffff, 3)
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


        // this.spotLight = new THREE.SpotLight(0xffffff);
        // this.spotLight.position.set(500, 1000, 500);
        // this.spotLight.castShadow = true;

        this.ambientLight = new THREE.AmbientLight(0xffffff);


        this.eventListener = new Eventlisteners();

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

    updateCameraPos = () => {
        this.camera.position.x = cameraGui.position.x
        this.camera.position.y = cameraGui.position.y
        this.camera.position.z = cameraGui.position.z

    }

    removeWelcomeScreen = () => {
        const divToRemove = document.getElementById("welcomeScreen")
        if (divToRemove) {
            divToRemove.remove()
            this.changeCameraPositionAfterWelcomeScreen()
            // this._initTerrainAfterWelcomeScreen()
        }
    }
    changeCameraPositionAfterWelcomeScreen = () => {
        gsap.to(this.camera.position, {

            x: this.carBody.position.x - 7,
            y: this.carBody.position.y + 6,
            z: this.carBody.position.z - 5,
            duration: 3,


            onUpdate: () => {

                this.camera.updateProjectionMatrix()
            },
            onComplete: () => {
                this.animationFinished = true;

            }

        })

    }
    _initTerrainAfterWelcomeScreen = () => {
        // this.rock = new Rocks(this.scene)
    }
}

class ThridPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }

    _CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-15, 20, -30);
        idealOffset.applyQuaternion(this._params.target.rotation);
        idealOffset.add(this._params.target.position);
        return idealOffset;
    }
    _CalculateIdealLookAt() {
        const idealLookAt = new THREE.Vector3(0, 10, 50);
        idealLookAt.applyQuaternion(this._params.target.rotation);
        idealLookAt.add(this._params.target.position);
        return idealLookAt;
    }


    updateCamera() {
        const idealOffset = this._CalculateIdealOffset();
        const idealLookAt = this._CalculateIdealLookAt();

        this._currentPosition.copy(idealOffset);
        this._currentLookAt.copy(idealLookAt);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);
    }
}


const app = new Application();

const gui = new dat.GUI()
const cameraGui = {
    position: {
        x: app.camera.position.x,
        y: app.camera.position.y,
        z: app.camera.position.z
    }
}
gui.add(cameraGui.position, 'x', -100, 100).onChange(app.updateCameraPos)
gui.add(cameraGui.position, 'y', -100, 100).onChange(app.updateCameraPos)
gui.add(cameraGui.position, 'z', -100, 100).onChange(app.updateCameraPos)



