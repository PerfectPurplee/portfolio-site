import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";


export class Box extends THREE.Mesh {
    constructor(width, height, depth, color) {

        super(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );


        this.height = height;
    }
}