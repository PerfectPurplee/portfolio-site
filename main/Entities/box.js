import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";


export class Box extends THREE.Mesh {
    constructor(width, height, depth, color, position = {
        x: 0,
        y: 0,
        z: 0
    }) {
        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );

        this.velocity = 0.03;
        this.height = height;
        this.width = width;
        this.depth = depth;

        this.position.set(position.x, position.y, position.z)
        this.currentBottomPosition = this.position.y - (height / 2)
        this.currentTopPosition = this.position.y + (height / 2)

    }

    // Update Car position based on ground
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