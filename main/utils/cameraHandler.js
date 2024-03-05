export class CameraHandler {

    constructor(camera, userInteracting) {
        this.camera = camera
        this.userInteracting = userInteracting
    }


    cameraLookAtHandler(object) {
        this.userInteracting.value = true
        this.camera.lookAt(object.scene.position.x, object.scene.position.y, object.scene.position.z)

    }

}

