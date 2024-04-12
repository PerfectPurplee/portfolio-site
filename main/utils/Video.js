import * as THREE from 'three';

export class Video {


    constructor(sourcePath, scene, positionX, positionY, positionZ, rotation, scaleX, scaleY) {
        this.sourcePath = sourcePath
        this.scene = scene


        this.setModelVideo(positionX,positionY,positionZ,rotation,scaleX,scaleY)
    }

    setModelVideo(positionX,positionY,positionZ,rotation,scaleX,scaleY) {

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
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.model.mesh = new THREE.Mesh(geometry, this.model.material);
        this.model.mesh.position.x = positionX
        this.model.mesh.position.y = positionY
        this.model.mesh.position.z = positionZ
        this.model.mesh.rotation.y = rotation
        this.model.mesh.scale.x = scaleX;
        this.model.mesh.scale.y = scaleY;

        this.scene.add(this.model.mesh)
    }

}