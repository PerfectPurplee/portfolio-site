import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Box, Car, createBillboard} from "./Entities/entities.js";
import {Eventlisteners} from "./Entities/eventlistener.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


export class Application {
    constructor() {
        this._initGraphicsWorld();
        this._initPhysicsWorld();

        // CANNON entities initialization

        // Car Body
        const radius = 1;
        this.carBody = new CANNON.Body({
            mass: 15,
            position: new CANNON.Vec3(0, 6, 0),
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.3, 1.5))
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
            mass,
            material: wheelMaterial
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
            mass,
            material: wheelMaterial
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
            mass,
            material: wheelMaterial
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
            mass,
            material: wheelMaterial
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
            color: 0xe3d68d,
            shininess: 100
        })
        this.ground = new THREE.Mesh(this.groundGeometry, this.groundMesh)
        this.ground.receiveShadow = true
        this.ground.position.copy(this.groundBody.position)
        this.ground.quaternion.copy(this.groundBody.quaternion)
        // this.cube = this.createEntity(1, 1, 1, 0xffffff);
        // this.cube.position.y = 2;
        // this.cube.castShadow = true;
        // this.cube.receiveShadow = true;
        //
        // this.cube2 = this.createEntity(10, 1, 20, 0xff0000);
        // this.cube2.position.y = 4
        // this.cube2.castShadow = true;
        // this.cube2.receiveShadow = true;

        // this.scene.add(this.cube2)
        // this.scene.add(this.cube)
        this.scene.add(this.ground)
        this.carMesh = new Car(this.scene, this.carBody)
        // this.scene.add(this.spotLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.light)


        this.eventListener = new Eventlisteners(this.vehicle);

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

        if (this.eventListener.moveForward) {
            this.vehicle.setWheelForce(-maxForce, 0)
            this.vehicle.setWheelForce(-maxForce, 1)
            this.frontWheel = this.carMesh.carModel.scene.getObjectByName('Front_wheel');
            this.frontWheel.rotation.z -= 0.03
        }
        if (this.eventListener.moveBackward) {
            this.vehicle.setWheelForce(maxForce / 2, 0)
            this.vehicle.setWheelForce(maxForce / 2, 1)
        }
        if (this.eventListener.moveLeft) {
            this.vehicle.setSteeringValue(maxSteerVal, 0)
            this.vehicle.setSteeringValue(maxSteerVal, 1)

        }
        if (this.eventListener.moveRight) {
            this.vehicle.setSteeringValue(-maxSteerVal, 0)
            this.vehicle.setSteeringValue(-maxSteerVal, 1)
        }
        if (!this.eventListener.moveForward && !this.eventListener.moveBackward) {
            this.vehicle.setWheelForce(0, 0)
            this.vehicle.setWheelForce(0, 1)
        }
        if (!this.eventListener.moveLeft && !this.eventListener.moveRight) {
            this.vehicle.setSteeringValue(0, 0)
            this.vehicle.setSteeringValue(0, 1)
        }


        // Graphics Update
        this.renderer.render(this.scene, this.camera)
        this.controls.update();

        if (this.carMesh.carModel && this.carBody) {
            this.carMesh.carModel.scene.position.x = this.carBody.position.x
            this.carMesh.carModel.scene.position.y = this.carBody.position.y - 0.1
            this.carMesh.carModel.scene.position.z = this.carBody.position.z

            this.carMesh.carModel.scene.quaternion.copy(this.carBody.quaternion)
        }


    }

    createEntity = (width, height, depth, color) => {
        return new Box(width, height, depth, color)
    }

    _initGraphicsWorld = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x000000);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(innerWidth, innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);


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

        this.camera.position.z = 7;
        this.camera.position.y = 5;

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
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane()
        })
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(this.groundBody);

        this.cannonDebugger = new CannonDebugger(this.scene, this.physicsWorld, {});

    }


}

new Application();
