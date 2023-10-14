import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


export class Box extends THREE.Mesh {
    constructor(width, height, depth, color, position = {
        x: 0,
        y: 0,
        z: 0
    }) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );

        this.velocity = 0.03;
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.position.set(position.x, position.y, position.z)
        this.currentBottomPosition = this.position.y - (height / 2)
        this.currentTopPosition = this.position.y + (height / 2)

    }

    // Update Car position based on ground
    updateVerticalPosition(ground) {
        this.currentBottomPosition = this.position.y - (this.height / 2)
        this.currentTopPosition = this.position.y + (this.height / 2)
        this.position.y = ground.currentTopPosition + (this.height / 2);
    }

    updateHorizontalPosition(eventListener) {
        if (eventListener.moveForward)
            this.position.z -= this.velocity;
        if (eventListener.moveBackward)
            this.position.z += this.velocity;
        if (eventListener.moveLeft)
            this.position.x -= this.velocity;
        if (eventListener.moveRight)
            this.position.x += this.velocity;
    }
}

export class Car {

    carModel;

    constructor(scene) {

        this.velocity = 0.03;
        this.carModel = null;
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load('./assets/car.gltf', (gltfScene) => {
            this.carModel = gltfScene;
            this.carModel.scene.position.set(0, 0, 0);
            this.carModel.scene.rotation.y = Math.PI;
            scene.add(gltfScene.scene)
        })


    }


    updateVerticalPosition(ground) {
        if (this.carModel) {
            this.carModel.scene.position.y = ground.currentTopPosition + (this.carModel.scene.halfHeight);
        }
    }

    updateHorizontalPosition(eventListener) {
        if (this.carModel) {
            if (eventListener.moveForward)
                this.carModel.scene.position.z -= this.velocity;
            if (eventListener.moveBackward)
                this.carModel.scene.position.z += this.velocity;
            if (eventListener.moveLeft)
                this.carModel.scene.position.x -= this.velocity;
            if (eventListener.moveRight)
                this.carModel.scene.position.x += this.velocity;
        }


    }
}


