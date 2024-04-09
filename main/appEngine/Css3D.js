import * as THREE from 'three';
import {CSS3DObject, CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';


export class Css3D {


    constructor(scene) {
        this._initCSS3DRenderer();
        this.scene = scene;
        this.billBoard1Content =
            this.setHtmlDivFor3DObject('<h1>HTML Content</h1><p>This is HTML content on a CSS3DObject.</p><button class="button">Click me</button>')
        // this.billBoard2Content
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


    setHtmlDivFor3DObject(innerHTML) {
        let div = document.createElement('div');
        div.innerHTML = innerHTML;
        let cssObject = new CSS3DObject(div);
        // cssObject.applyQuaternion()


        cssObject.position.set(0, 0, 0); // Adjust position
        this.scene.add(cssObject);
        return cssObject
    }
}