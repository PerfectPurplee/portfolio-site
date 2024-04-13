import * as THREE from "three";
import {gsap} from "gsap";

export class RayCasterHandler {

    constructor(cameraHandler, camera, scene, litOfBillboards, userInteracting, isCameraInCar, listOfSpotlights) {
        this.listOfSpotlights = listOfSpotlights
        this.userInteracting = userInteracting
        this.cameraHandler = cameraHandler
        this.camera = camera
        this.listOfBillboards = litOfBillboards
        this.pointerMove = new THREE.Vector2();
        this.pointerClick = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scene = scene
        this.isCameraInCar = isCameraInCar;

    }

    handleRayCasterPointerMove() {
        this.raycaster.setFromCamera(this.pointerMove, this.camera)
        const intersectsMove = this.raycaster.intersectObjects(this.scene.children);
        //  Scaling icons
        if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "GitHub-logo" &&
            intersectsMove[0].object.userData.name === "billboard1" && this.userInteracting.value === true) {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
        } else if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "GitHub-logo" &&
            intersectsMove[0].object.userData.name === "billboard2" && this.userInteracting.value === true) {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
        } else if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "GitHub-logo" &&
            intersectsMove[0].object.userData.name === "billboard3" && this.userInteracting.value === true) {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
        }//Icons in car
        //LinkedIn
        else if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "linkedin-with-circle-icon-512x512-cvyrro5n") {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
        }// mail
        else if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "58485698e0bb315b0f7675a8") {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
            // Github
        } else if (intersectsMove.length > 0 && intersectsMove[0].object.material.name === "GitHub-logo" &&
            intersectsMove[0].object.userData.name === "car" && this.isCameraInCar.value === true) {
            this.setScaleForIconButton(intersectsMove[0].object, 1)
        }
          else  this.scaleBackIconButtons();

        // Turns on/off spotlights on billboards on mouse hover
        if (intersectsMove.length > 0 && (
            intersectsMove[0].object.userData.name === "billboard1" ||
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

    // intersectsClick[0].object.scale.x += 5;
    handleRayCasterPointerClick() {
        this.raycaster.setFromCamera(this.pointerClick, this.camera)
        const intersectsClick = this.raycaster.intersectObjects(this.scene.children);
        console.log(intersectsClick)
        // Icons on billboard
        if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "GitHub-logo" &&
            intersectsClick[0].object.userData.name === "billboard1" && this.userInteracting.value === true) {
            window.open('https://github.com/PerfectPurplee/AINotesBackend', '_blank')
        } else if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "GitHub-logo" &&
            intersectsClick[0].object.userData.name === "billboard2" && this.userInteracting.value === true) {
            window.open('https://github.com/PerfectPurplee/Aether-Arena', '_blank')
        } else if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "GitHub-logo" &&
            intersectsClick[0].object.userData.name === "billboard3" && this.userInteracting.value === true) {
            window.open('https://github.com/PerfectPurplee/portfolio-site', '_blank')
        }
            //Icons in car
        //LinkedIn
        else if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "linkedin-with-circle-icon-512x512-cvyrro5n") {
            window.open('https://github.com/PerfectPurplee', '_blank')
            // mail
        } else if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "58485698e0bb315b0f7675a8") {
            window.open('https://github.com/PerfectPurplee/portfolio-site', '_blank')
            // Github
        } else if (intersectsClick.length > 0 && intersectsClick[0].object.material.name === "GitHub-logo" &&
            intersectsClick[0].object.userData.name === "car" && this.isCameraInCar.value === true) {
            window.open('https://github.com/PerfectPurplee', '_blank')
        }
        // MoveCameraIntoCar
        else if (intersectsClick.length > 0 && intersectsClick[0].object.userData.name === "car"
            && this.userInteracting.value === false && this.isCameraInCar.value === false
            && !document.contains(document.getElementById('welcomeScreen'))) {
            this.cameraHandler.moveCameraInsideCar()
        } else if (intersectsClick.length > 0 && (intersectsClick[0].object.userData.name === "billboard1" ||
            intersectsClick[0].object.userData.name === "billboard2" ||
            intersectsClick[0].object.userData.name === "billboard3") && this.userInteracting.value === false) {
            let billboard = this.getBillboardByUserDataName(intersectsClick[0].object.userData.name)
            this.cameraHandler.cameraLookAtAndMoveCloserHandler(billboard)
        } else if (intersectsClick.length > 0 && (intersectsClick[1].object.userData.name === "billboard1" ||
            intersectsClick[1].object.userData.name === "billboard2" ||
            intersectsClick[1].object.userData.name === "billboard3") && this.userInteracting.value === false) {
            let billboard = this.getBillboardByUserDataName(intersectsClick[1].object.userData.name)
            this.cameraHandler.cameraLookAtAndMoveCloserHandler(billboard)
        } else if (this.userInteracting.value || this.isCameraInCar.value) {
            this.cameraHandler.animateCameraPosToCar()
        }

    }

    getBillboardByUserDataName(name) {
        return this.listOfBillboards.find((billboard) => billboard.name === name) || null
    }

    getSpotlightByBillboardName(billboardName) {
        if (billboardName === "billboard1") return this.listOfSpotlights[0]
        if (billboardName === "billboard2") return this.listOfSpotlights[1]
        if (billboardName === "billboard3") return this.listOfSpotlights[2]
    }

    setScaleForIconButton(object, scaleValue) {

        if (!object.userData.isScaled) {
            object.scale.x += scaleValue;
            object.scale.y += scaleValue;
            object.userData.isScaled = true;
        }

    }

    scaleBackIconButtons() {
       this.listOfBillboards.forEach((billboard) => {
           if (billboard.billboardModel.scene.userData.isScaled === true) {
               billboard.billboardModel.scene.scale.x = 1;
               billboard.billboardModel.scene.scale.y = 1;
               billboard.billboardModel.scene.userData.isScaled = false;
           }
       })
    }


}











