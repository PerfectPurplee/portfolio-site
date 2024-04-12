import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {element} from "three/nodes";


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
        this.gltfLoader.load('./assets/tesla/tesla.gltf', (gltfScene) => {

            this.carModel = gltfScene;
            this.carModel.scene.position.copy(carBody.position)
            this.carModel.scene.quaternion.copy(carBody.quaternion)
            this.carModel.scene.scale.set(0.01, 0.01, 0.01)
            this.carModel.scene.castShadow = true;
            // exploreModelHierarchy(gltfScene.scene, ' ')

            this.carModel.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.name = 'car';
                }
            });

            this.frontLeftWheel = this.carModel.scene.getObjectByName('wheels_wheels3_0');
            this.frontRightWheel = this.carModel.scene.getObjectByName('Front_wheel001');
            this.backLeftWheel = this.carModel.scene.getObjectByName('Rear_wheel');
            this.backRightWheel = this.carModel.scene.getObjectByName('Rear_wheel001');
            this.frontWheels = this.carModel.scene.getObjectByName('wheels');
            this.backWheels = this.carModel.scene.getObjectByName('backWheels');
            this.LCD = this.carModel.scene.getObjectByName('LCDs_LCDs0_0');
            this.steeringWheel = this.carModel.scene.getObjectByName('movsteer_10');

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

export class Billboard {

    constructor(scene, position = {x: 0, y: 0, z: 0},
                rotation = -Math.PI / 1.2, name, filePath) {
        this.name = name

        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load(filePath, (gltfScene) => {

            this.billboardModel = gltfScene;
            this.billboardModel.scene.position.set(position.x, position.y, position.z);
            this.billboardModel.scene.rotation.y = rotation;
            this.billboardModel.castShadow = true
            this.billboardModel.receiveShadow = true
            this.billboardModel.scene.userData.name = name

            this.billboardModel.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.name = name
                }
            });


            scene.add(this.billboardModel.scene)

        })
    }
}


function exploreModelHierarchy(obj, indent) {
    console.log(indent + obj.name);

    // Recursively traverse child objects
    if (obj.children) {
        for (let i = 0; i < obj.children.length; i++) {
            exploreModelHierarchy(obj.children[i], indent + '  ');
        }
    }
}




