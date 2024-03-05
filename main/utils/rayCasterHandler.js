import * as THREE from "three";


export class RayCasterHandler {

    constructor(cameraHandler, camera, scene, litOfBillboards, userInteracting) {
        this.userInteracting = userInteracting
        this.cameraHandler = cameraHandler
        this.camera = camera
        this.listOfBillboards = litOfBillboards
        this.pointerMove = new THREE.Vector2();
        this.pointerClick = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scene = scene

    }

    handleRayCasterPointerMove() {
        this.raycaster.setFromCamera(this.pointerMove, this.camera)
        const intersectsMove = this.raycaster.intersectObjects(this.scene.children);
        if (intersectsMove.length > 0 && (intersectsMove[0].object.userData.name === "billboard1" ||
            intersectsMove[0].object.userData.name === "billboard2" ||
            intersectsMove[0].object.userData.name === "billboard3")) {

        }
    }

    handleRayCasterPointerClick() {
        this.raycaster.setFromCamera(this.pointerClick, this.camera)
        const intersectsClick = this.raycaster.intersectObjects(this.scene.children);
        if (intersectsClick.length > 0 && (intersectsClick[0].object.userData.name === "billboard1" ||
            intersectsClick[0].object.userData.name === "billboard2" ||
            intersectsClick[0].object.userData.name === "billboard3")) {
            let billboard = this.getBillboardByUserDataName(intersectsClick[0].object.userData.name)
            this.cameraHandler.cameraLookAtHandler(billboard.billboardModel)
        } else this.userInteracting.value = false
    }

    getBillboardByUserDataName(name) {
        return this.listOfBillboards.find((billboard) => billboard.name === name) || null
    }

}











