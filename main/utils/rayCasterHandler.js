import * as THREE from "three";
import {gsap} from "gsap";

export class RayCasterHandler {

    constructor(cameraHandler, camera, scene, litOfBillboards, userInteracting, listOfSpotlights) {
        this.listOfSpotlights = listOfSpotlights
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

        // Turns on/off spotlights on billboards on mouse hover
        if (intersectsMove.length > 0 && (intersectsMove[0].object.userData.name === "billboard1" ||
            intersectsMove[0].object.userData.name === "billboard2" ||
            intersectsMove[0].object.userData.name === "billboard3")) {

            this.listOfSpotlights.forEach((element) => {
                if (element === this.getSpotlightByBillboardName(intersectsMove[0].object.userData.name)) {
                    if (element.decay !== 1 && element.penumbra !== 0.4) {
                        gsap.to(element, {
                            decay: 1,
                            penumbra: 0.4,
                            duration: 0.5
                        })
                    }
                } else {
                    if (element.decay !== 2 || element.penumbra !== 1) {
                        gsap.to(element, {
                            decay: 2,
                            penumbra: 1,
                            duration: 1
                        })
                    }

                }
            })
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

    getSpotlightByBillboardName(billboardName) {
        if (billboardName === "billboard1") return this.listOfSpotlights[0]
        if (billboardName === "billboard2") return this.listOfSpotlights[1]
        if (billboardName === "billboard3") return this.listOfSpotlights[2]
    }

}











