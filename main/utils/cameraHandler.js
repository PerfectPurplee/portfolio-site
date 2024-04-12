import * as THREE from 'three';
import {gsap} from "gsap";

export class CameraHandler {

    constructor(camera, userInteracting, carBody, carMesh, isCameraInCar, initialCameraLookAtBillboards, animateCameraToCar) {
        this.camera = camera
        this.userInteracting = userInteracting
        this.carBody = carBody
        this.initialCameraLookAtBillboards = initialCameraLookAtBillboards
        this.carMesh = carMesh;
        this.isCameraInCar = isCameraInCar;
        this.animateCameraToCar = animateCameraToCar;

    }


    cameraLookAtHandler(object) {
        const boundingBox = new THREE.Box3().setFromObject(object.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        gsap.to(this.currentCameraLookAt, {

            x: center.x,
            y: center.y,
            z: center.z,
            duration: 1,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x, this.currentCameraLookAt.y, this.currentCameraLookAt.z)
            },
            onComplete: () => {
            }
        })

    }

    cameraLookAtAndMoveCloserHandler(object) {
        this.initialCameraLookAtBillboards.value = false
        const boundingBox = new THREE.Box3().setFromObject(object.billboardModel.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const cameraOffsetForCurrentBillboard = this.setCameraPositionCoordinates(object)
        this.userInteracting.value = true
        gsap.to(this.currentCameraLookAt, {

            x: center.x,
            y: center.y + 2,
            z: center.z,
            duration: 1,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x, this.currentCameraLookAt.y, this.currentCameraLookAt.z)
            },
            onComplete: () => {
            }
        })
        gsap.to(this.camera.position, {

            x: center.x + cameraOffsetForCurrentBillboard.x,
            y: center.y + cameraOffsetForCurrentBillboard.y,
            z: center.z + cameraOffsetForCurrentBillboard.z,
            duration: 1,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            }

        })

    }

    moveCameraInsideCar() {

        this.userInteracting.value = true

        const boundingBoxLCD = new THREE.Box3().setFromObject(this.carMesh.LCD);
        const centerLCD = new THREE.Vector3();
        boundingBoxLCD.getCenter(centerLCD);

        const boundingBox = new THREE.Box3().setFromObject(this.carMesh.carModel.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        gsap.to(this.currentCameraLookAt, {

            x: centerLCD.x,
            y: centerLCD.y + 0.1,
            z: centerLCD.z,
            duration: 2,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x, this.currentCameraLookAt.y, this.currentCameraLookAt.z)
                this.camera.updateProjectionMatrix()
            },

        })

        gsap.to(this.camera, {

            fov: 50,
            duration: 2,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            },
            onComplete: () => {

            }

        })

        gsap.to(this.camera.position, {
            x: this.carBody.position.x,
            y: center.y + 0.5,
            z: this.carBody.position.z,
            duration: 2,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            },
            onComplete: () => {
                this.isCameraInCar.value = true;
            }

        })


    }

    setCurrentCameraLookAt(currentCameraLookAt) {
        this.currentCameraLookAt = currentCameraLookAt
    }

    setCameraPositionCoordinates(billboard) {
        if (billboard.name === "billboard1") return {
            x: -7,
            y: 2,
            z: 4.8
        }
        if (billboard.name === "billboard2") return {
            x: -9,
            y: 2,
            z: 0
        }
        if (billboard.name === "billboard3") return {
            x: -5.8,
            y: 2,
            z: -5
        }
    }

    animateCameraPosToCar() {
        gsap.to(this.camera.position, {

            x: this.carBody.position.x - 8,
            y: this.carBody.position.y + 6,
            z: this.carBody.position.z,
            duration: 1,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            },

            onComplete: () => {
                this.userInteracting.value = false
                this.initialCameraLookAtBillboards.value = false
                this.isCameraInCar.value = false
            }

        })
        gsap.to(this.currentCameraLookAt, {

            x: this.carBody.position.x + 10,
            y: this.carBody.position.y,
            z: this.carBody.position.z,
            duration: 1,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x, this.currentCameraLookAt.y, this.currentCameraLookAt.z)
            },
        })
        gsap.to(this.camera, {

            fov: 75,
            duration: 1,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            }

        })


    }

}


