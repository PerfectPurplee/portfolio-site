import * as THREE from 'three';

export class Video {


    constructor(sourcePath, scene) {
        this.sourcePath = sourcePath
        this.scene = scene

        this.setModelVideo()
    }

    setModelVideo() {

        this.model = {}

        // Element
        this.model.element = document.createElement('video')
        this.model.element.muted = true
        this.model.element.loop = true
        this.model.element.controls = true
        this.model.element.playsInline = true
        this.model.element.autoplay = true
        this.model.element.src = this.sourcePath
        this.model.element.play()

        // Texture
        this.model.texture = new THREE.VideoTexture(this.model.element)
        this.model.texture.encoding = THREE.sRGBEncoding

        // Material
        this.model.material = new THREE.MeshBasicMaterial({
            map: this.model.texture
        })

        // Mesh
        const geometry = new THREE.PlaneGeometry(200, 200);
        this.model.mesh = new THREE.Mesh(geometry, this.model.material);
        this.scene.add(this.model.mesh)
    }

}