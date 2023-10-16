import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


export class Box extends THREE.Mesh {
    constructor(width, height, depth, color, position = {
        x: 0,
        y: 0,
        z: 0
    }) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshPhongMaterial({
                color: color,
                shininess: 1000
            })
        );

        this.velocity = 0.03;
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.position.set(position.x, position.y, position.z)
        this.currentBottomPosition = this.position.y - (height / 2)
        this.currentTopPosition = this.position.y + (height / 2)

        this.receiveShadow = true
    }

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

    constructor(scene, carBody) {

        this.velocity = 0.5;
        this.carModel = null;
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load('./assets/drifter/scene.gltf', (gltfScene) => {

            this.carModel = gltfScene;
            this.carModel.scene.position.copy(carBody.position)
            this.carModel.scene.quaternion.copy(carBody.quaternion)
            this.carModel.scene.scale.set(0.01, 0.01, 0.01)
            this.carModel.scene.castShadow = true;
            exploreModelHierarchy(gltfScene.scene, ' ')

            this.carModel.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.frontLeftWheel = this.carModel.scene.getObjectByName('Front_wheel');
            this.frontRightWheel = this.carModel.scene.getObjectByName('Front_wheel001');
            this.backLeftWheel = this.carModel.scene.getObjectByName('Rear_wheel');
            this.backRightWheel = this.carModel.scene.getObjectByName('Rear_wheel001');
            scene.add(this.carModel.scene)
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
            if (eventListener.moveRight) {
                this.carModel.scene.position.x += this.velocity;
            }
        }


    }
}

export function createBillboard(scene) {
    let billboardModel;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/billboardLowPoly.gltf', (gltfScene) => {
        billboardModel = gltfScene;
        // billboardModel.scene.position.set(30, 0, 50);
        // billboardModel.scene.scale.set(0.1, 0.1, 0.1)
        billboardModel.scene.rotation.y = Math.PI / 2;
        scene.add(gltfScene.scene)

    })
}

function exploreModelHierarchy(obj, indent) {
    console.log(indent + obj.name);

    // Recursively traverse child objects
    if (obj.children) {
        for (var i = 0; i < obj.children.length; i++) {
            exploreModelHierarchy(obj.children[i], indent + '  ');
        }
    }
}


