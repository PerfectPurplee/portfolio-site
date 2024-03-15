import * as THREE from 'three';
import {gsap} from "gsap";

export class CameraHandler {

    constructor(camera, userInteracting) {
        this.camera = camera
        this.userInteracting = userInteracting

    }


    cameraLookAtHandler(object) {
        const boundingBox = new THREE.Box3().setFromObject(object.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        this.userInteracting.value = true
        gsap.to(this.currentCameraLookAt, {

            x: center.x,
            y: center.y,
            z: center.z,
            duration: 1,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x,this.currentCameraLookAt.y, this.currentCameraLookAt.z)
            },
            onComplete: () => {
            }
        })

    }

    cameraLookAtAndMoveCloserHandler(object) {
        const boundingBox = new THREE.Box3().setFromObject(object.scene);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        this.userInteracting.value = true
        gsap.to(this.currentCameraLookAt, {

            x: center.x,
            y: center.y,
            z: center.z,
            duration: 1,

            onUpdate: () => {
                this.camera.lookAt(this.currentCameraLookAt.x,this.currentCameraLookAt.y, this.currentCameraLookAt.z)
            },
            onComplete: () => {
            }
        })
        gsap.to(this.camera.position, {

            x: center.x -20,
            y: center.y,
            z: center.z,
            duration: 2,

            onUpdate: () => {
                this.camera.updateProjectionMatrix()
            }

        })

    }

    setCurrentCameraLookAt(currentCameraLookAt) {
        this.currentCameraLookAt = currentCameraLookAt
    }

}

