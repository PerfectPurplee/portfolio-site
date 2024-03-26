import * as THREE from 'three';
import {CSS3DObject, CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';


export class Css3D {


    constructor() {
        this._initCSS3DRenderer();
        this.scene = new THREE.Scene();
        this.div = document.createElement('div');
        // div.id = 'overlay';
        this.div.innerHTML = '<h1>HTML Content</h1><p>This is HTML content on a CSS3DObject.</p><button class="button">Click me</button>';
        this.cssObject = new CSS3DObject(this.div);
        this.cssObject.position.set(0, 0, 0); // Adjust position
        this.scene.add(this.cssObject);
    }

    _initCSS3DRenderer() {
        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = 0;
        document.getElementById('container').appendChild(this.renderer.domElement);
    }

    set3DObjects() {

    }


    setHtmlDivFor3DObject() {

    }
}