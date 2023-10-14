import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {Box} from "./Entities/box.js";


export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(innerWidth, innerHeight)

        document.body.appendChild(this.renderer.domElement)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);


        this.light = new THREE.DirectionalLight(0xffffff, 1)
        this.light.position.set(0, 5, 3);
        this.light.target = this.scene;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.castShadow = true;

        this.cube = this.createEntity(1, 1, 1, 0xff0000)
        this.ground = this.createEntity(10, 0.4, 20, 0x00ff00)
        this.cube.position.y = 2;
        this.cube.castShadow = true;


        this.ground.receiveShadow = true

        this.camera.position.z = 6;
        this.camera.position.y = 2;

        this.scene.add(this.light)
        this.scene.add(this.ground)

        this.scene.add(this.cube)
        this.scene.add(this.light)


        this.animate();
    }

    animate = () => {
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera)
        this.controls.update();


        // this.cube.rotation.x += 0.01;


    }

    createEntity = (width, height, depth, color) => {
        return new Box(width, height, depth, color)
    }
    createLight

}

new Game()