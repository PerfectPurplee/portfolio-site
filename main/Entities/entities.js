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
        this.gltfLoader.load('./assets/drifter/scene.gltf', (gltfScene) => {

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

export class Billboard {
    billboardModel;

    constructor(scene, position = {
        x: 0,
        y: 0,
        z: 0
    }) {

        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load('./assets/billboard/scene.gltf', (gltfScene) => {
            this.billboardModel = gltfScene;
            this.billboardModel.scene.position.set(position.x, position.y, position.z);
            this.billboardModel.scene.rotation.y = -Math.PI / 1.2;

            this.billboardModel.castShadow = true
            this.billboardModel.receiveShadow = true

            this.billboardModel.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });


            scene.add(gltfScene.scene)

        })
    }
}

export class Rocks {
    rocksModel = [0, 1];

    constructor(scene) {
        this._initFirstTrackOfRocks(scene);
        this._initLeftTrackOfRocks(scene);
        this._initRightTrackOfRocks(scene);
        this._initFinalTrackOfRocks(scene);


    }

    _initFirstTrackOfRocks = (scene) => {
        // lower means more intensity
        const lengthOfOneClusterOfRocks = 6;
        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 2; j++) {
                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.load('./assets/rocks/scene.gltf', (gltfScene) => {
                    this.rocksModel[j] = gltfScene;
                    exploreModelHierarchy(gltfScene.scene, ' ')
                    if (j === 0)
                        this.rocksModel[j].scene.position.set(-1 + i * lengthOfOneClusterOfRocks, 0, 5)
                    else
                        this.rocksModel[j].scene.position.set(-1 + i * lengthOfOneClusterOfRocks, 0, -5)

                    this.rocksModel[j].scene.scale.set(0.005, 0.005, 0.005)
                    this.rocksModel[j].scene.rotation.y = Math.PI / 2;
                    this.rocksModel[j].scene.castShadow = true
                    this.rocksModel[j].scene.receiveShadow = true

                    this.rocksModel[j].scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });



                    scene.add(this.rocksModel[j].scene)
                })
            }
        }
    }

    _initLeftTrackOfRocks = (scene) => {
        const lengthOfOneClusterOfRocks = 6;
        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 2; j++) {
                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.load('./assets/rocks/scene.gltf', (gltfScene) => {
                    this.rocksModel[j] = gltfScene;
                    if (j === 0)
                        this.rocksModel[j].scene.position.set(-1 + 8 * lengthOfOneClusterOfRocks, 0, -(-1 + i * lengthOfOneClusterOfRocks) - 10)
                    else
                        this.rocksModel[j].scene.position.set(-1 + 8 * lengthOfOneClusterOfRocks + 10, 0, -(-1 + i * lengthOfOneClusterOfRocks) - 10)

                    this.rocksModel[j].scene.scale.set(0.005, 0.005, 0.005)
                    this.rocksModel[j].scene.rotation.y = Math.PI;
                    this.rocksModel[j].scene.castShadow = true
                    this.rocksModel[j].scene.receiveShadow = true


                    this.rocksModel[j].scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    scene.add(this.rocksModel[j].scene)
                })
            }
        }
    }
    _initRightTrackOfRocks = (scene) => {
        const lengthOfOneClusterOfRocks = 6;
        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 2; j++) {
                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.load('./assets/rocks/scene.gltf', (gltfScene) => {
                    this.rocksModel[j] = gltfScene;
                    if (j === 0)
                        this.rocksModel[j].scene.position.set(-1 + 8 * lengthOfOneClusterOfRocks, 0, (-1 + i * lengthOfOneClusterOfRocks) + 10)
                    else
                        this.rocksModel[j].scene.position.set(-1 + 8 * lengthOfOneClusterOfRocks + 10, 0, (-1 + i * lengthOfOneClusterOfRocks) + 10)

                    this.rocksModel[j].scene.scale.set(0.005, 0.005, 0.005)
                    this.rocksModel[j].scene.rotation.y = Math.PI;
                    this.rocksModel[j].scene.castShadow = true
                    this.rocksModel[j].scene.receiveShadow = true


                    this.rocksModel[j].scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    scene.add(this.rocksModel[j].scene)
                })
            }
        }
    }
    _initFinalTrackOfRocks = (scene) => {
        // lower means more intensity
        const lengthOfOneClusterOfRocks = 6;
        for (let i = 9; i < 15; i++) {

            for (let j = 0; j < 2; j++) {
                this.gltfLoader = new GLTFLoader();
                this.gltfLoader.load('./assets/rocks/scene.gltf', (gltfScene) => {
                    this.rocksModel[j] = gltfScene;
                    exploreModelHierarchy(gltfScene.scene, ' ')
                    if (j === 0)
                        this.rocksModel[j].scene.position.set(-1 + i * lengthOfOneClusterOfRocks + 10, 0, 5)
                    else
                        this.rocksModel[j].scene.position.set(-1 + i * lengthOfOneClusterOfRocks + 10, 0, -5)

                    this.rocksModel[j].scene.scale.set(0.005, 0.005, 0.005)
                    this.rocksModel[j].scene.rotation.y = Math.PI / 2;
                    this.rocksModel[j].scene.castShadow = true
                    this.rocksModel[j].scene.receiveShadow = true

                    this.rocksModel[j].scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });



                    scene.add(this.rocksModel[j].scene)
                })
            }
        }
    }
}

export class StoneFloor {
    stoneFloor;

    constructor(scene) {
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.load('./assets/stonefloor/scene.gltf', (gltfScene) => {
            this.stoneFloor = gltfScene;
            this.stoneFloor.scene.position.set(0, 0.001, 0)
            this.stoneFloor.scene.scale.set(0.01, 0.01, 0.01)
            this.stoneFloor.scene.castShadow = true
            this.stoneFloor.scene.receiveShadow = true

            this.stoneFloor.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(this.stoneFloor.scene)
        })
    }
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


