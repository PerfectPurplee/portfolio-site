import * as THREE from 'three';


export class Html3D {

    constructor(scene) {
        this.scene = scene;
        this.billboard1Content = this.create3DHtmlContent('billboard1');
    }


    create3DHtmlContent(tagName) {
        // Create HTML element
        let htmlContent = document.createElement(tagName);
        htmlContent.classList.add('font-exo');
        htmlContent.textContent = "HELLO MORDKO MOJA TY KOCHANA TO DZIALA";

        // Create a canvas element
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = 512; // Set canvas dimensions
        canvas.height = 256;
        context.fillStyle = 'black'; // Set canvas background color
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '20px Arial'; // Set font properties
        context.fillStyle = 'white'; // Set text colorssss
        context.fillText(htmlContent.textContent, 10, 30); // Draw text onto canvas

        // Create texture from canvas
        let htmlTexture = new THREE.CanvasTexture(canvas);
        htmlTexture.needsUpdate = true; // Ensure texture update

        // Create material with HTML texture
        let material = new THREE.MeshBasicMaterial({map: htmlTexture});

        // Create plane geometry
        let geometry = new THREE.PlaneGeometry(30, 30);

        // Create plane mesh with material
        let plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);


        return plane;
    }
}