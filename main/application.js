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
        const radius = 1;
        this.sphereBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Sphere(radius)
        });
        this.sphereBody.position.set(-1, 3, 0);
        this.physicsWorld.addBody(this.sphereBody);

        this.boxBody = new CANNON.Body({
            mass: 3,
            shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
        })
        this.boxBody.position.set(-1.2, 8, 0)
        this.physicsWorld.addBody(this.boxBody)


        // THREE entities initialization

        this.cube = this.createEntity(2, 2, 2, 0xffffff)
        // this.ground = this.createEntity(100, 0.4, 100, 0xfcf292)
        const sphereGeo = new THREE.SphereGeometry(radius)
        const material = new THREE.MeshBasicMaterial();
        this.sphere = new THREE.Mesh(sphereGeo, material);
        this.sphere.position.copy(this.sphereBody.position)
        this.scene.add(this.sphere)
        this.scene.add(this.cube)


        // this.cube.position.y = 2;
        // this.cube.castShadow = true;
        //
        // this.ground.receiveShadow = true

        // this.scene.add(this.spotLight);
        // this.scene.add(this.ambientLight);
        // this.scene.add(this.ground)
        // this.car = new Car(this.scene)
        // this.scene.add(this.light)

        // createBillboard(this.scene);
        // this.scene.add(this.cube)

        this.update();

    }

    update = () => {
        requestAnimationFrame(this.update)

        // Physics Update
        this.physicsWorld.fixedStep();
        if (this.cannonDebugger)
            this.cannonDebugger.update();

        // Graphics Update
        this.renderer.render(this.scene, this.camera)
        this.controls.update();

        this.sphere.position.copy(this.sphereBody.position)
        this.sphere.quaternion.copy(this.sphereBody.quaternion)
        this.cube.position.copy(this.boxBody.position)
        this.cube.quaternion.copy(this.boxBody.quaternion)

        // this.cube.updateVerticalPosition(this.ground)
        // this.cube.updateHorizontalPosition(this.eventListener)
        // // this.car.updateVerticalPosition(this.ground)
        // this.car.updateHorizontalPosition(this.eventListener)


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


        this.light = new THREE.DirectionalLight(0xffffff, 1)
        this.light.position.set(0, 100, 0);
        this.light.target = this.scene;
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

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(500, 1000, 500);
        this.spotLight.castShadow = true;

        this.ambientLight = new THREE.AmbientLight(0xffffff);
        this.spotLight.shadowMapWidth = 1024;
        this.spotLight.shadowMapHeight = 1024;


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

