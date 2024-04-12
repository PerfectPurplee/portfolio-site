import {gsap} from "gsap";

export class AnimationHandler {

    animateCameraToCar;
    camera;
    carBody;
    isCameraInCar;
    animationProcess;

    constructor(camera, carBody, isCameraInCar) {
        this.camera = camera;
        this.carBody = carBody;
        this.animationProcess = 0.1;
        this.isCameraInCar = isCameraInCar;

        this.animateCameraToCar = {value: false}
    }

    update() {
        if (this.animateCameraToCar.value) this.updateCameraPositionIntoCar()
    }

    updateCameraPositionIntoCar() {

        const determineTraceX = this.carBody.position.x - this.camera.position.x * this.animationProcess
        const determineTraceZ = this.carBody.position.z - this.camera.position.z * this.animationProcess

        this.animationProcess += 0.1
        this.camera.position.set(this.camera.position.x + determineTraceX, this.camera.position.y, this.camera.position.z + determineTraceZ)
        this.camera.updateProjectionMatrix();

        if (this.animationProcess >= 1) {
            this.animateCameraToCar.value = false;
            this.isCameraInCar.value = true;
        }

    }
}

