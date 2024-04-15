import {GUI} from "dat.gui";

export class DatGui {

    constructor(app) {
        this.gui = new GUI()
        this.app = app;
        this.spotLight = this.app.spotLight1
        this.video1 = this.app.video1;
        this.video2 = this.app.video2;

        const billboardFolder = this.gui.addFolder('Billboard Position');
        const cameraFolder = this.gui.addFolder('Camera')

        this.addBillboardToGui(this.billboard1Gui = this.setBillboardGui(40, 0, -16.6, -1.6), billboardFolder, -50, 50, app)
        this.addBillboardToGui(this.billboard2Gui = this.setBillboardGui(46, 0, 1.2, -2.4), billboardFolder, -50, 50, app)
        this.addBillboardToGui(this.billboard3Gui = this.setBillboardGui(27, 0, -28, -1), billboardFolder, -50, 50, app)

        cameraFolder.add(app.camera.position, 'x', -100, 100)
        cameraFolder.add(app.camera.position, 'y', -100, 100)
        cameraFolder.add(app.camera.position, 'z', -100, 100)
        cameraFolder.add(app.camera, 'fov', -100, 100)
        this.videoFolder = this.gui.addFolder('Video');
        this.addSpotlightToGui()
        // this.addVideoToGui(this.video1)
        this.addVideoToGui(this.video2)
        // this.addCSS3DObjectToGui()
        // this.addHtmlCanvasMesh()


    }

    setBillboardGui(x, y, z, rotation) {
        return {
            position: {
                x: x,
                y: y,
                z: z,
                rotation: rotation
            },
        };
    }

    addBillboardToGui(billboardGui, folder, min, max, app) {
        folder.add(billboardGui.position, 'x', min, max).name('X').onChange(app.updateAllBillboardsPositions)
        folder.add(billboardGui.position, 'y', min, max).name('Y').onChange(app.updateAllBillboardsPositions)
        folder.add(billboardGui.position, 'z', min, max).name('Z').onChange(app.updateAllBillboardsPositions)
        folder.add(billboardGui.position, 'rotation', -Math.PI, Math.PI).onChange(app.updateAllBillboardsPositions)

    }

    addSpotlightToGui() {

        const spotLightFolder = this.gui.addFolder('SpotLight');
        spotLightFolder.add(this.spotLight, 'intensity', 0, 2000).name('Intensity');
        spotLightFolder.add(this.spotLight, 'distance', 0, 100).name('Distance');
        spotLightFolder.add(this.spotLight, 'angle', 0, Math.PI / 2).name('Angle');
        spotLightFolder.add(this.spotLight, 'penumbra', 0, 1).name('Penumbra');
        spotLightFolder.add(this.spotLight, 'decay', 0, 2).name('Decay');

        const spotLightPositionFolder = spotLightFolder.addFolder('Position');
        spotLightPositionFolder.add(this.spotLight.position, 'x', -50, 50).name('X');
        spotLightPositionFolder.add(this.spotLight.position, 'y', -50, 50).name('Y');
        spotLightPositionFolder.add(this.spotLight.position, 'z', -50, 50).name('Z');

        const spotLightTargetPositionFolder = spotLightFolder.addFolder('Target Position');
        spotLightTargetPositionFolder.add(this.spotLight.target.position, 'x', -50, 50).name('X');
        spotLightTargetPositionFolder.add(this.spotLight.target.position, 'y', -50, 50).name('Y');
        spotLightTargetPositionFolder.add(this.spotLight.target.position, 'z', -50, 50).name('Z');
    }

    addCSS3DObjectToGui() {
        const cssFolder = this.gui.addFolder('CSS3D');
        cssFolder.add(this.app.css3D.billBoard1Content.position, 'x', -50, 300).name('X');
        cssFolder.add(this.app.css3D.billBoard1Content.position, 'y', -50, 300).name('Y');
        cssFolder.add(this.app.css3D.billBoard1Content.position, 'z', -50, 300).name('Z');

        cssFolder.add(this.app.css3D.billBoard1Content.rotation, 'x', -Math.PI, Math.PI).name('Rotation')
        cssFolder.add(this.app.css3D.billBoard1Content.rotation, 'y', -Math.PI, Math.PI).name('Rotation')
        cssFolder.add(this.app.css3D.billBoard1Content.rotation, 'z', -Math.PI, Math.PI).name('Rotation')

    }

    addHtmlCanvasMesh() {
        const canvasFolder = this.gui.addFolder('HtmlCanvas');
        canvasFolder.add(this.app.html3D.billboard1Content.position, 'x', -50, 300).name('X');
        canvasFolder.add(this.app.html3D.billboard1Content.position, 'y', -50, 300).name('Y');
        canvasFolder.add(this.app.html3D.billboard1Content.position, 'z', -50, 300).name('Z');

        canvasFolder.add(this.app.html3D.billboard1Content.rotation, 'y', -Math.PI, Math.PI).name('Rotation')

        canvasFolder.add(this.app.html3D.billboard1Content.scale, 'x', 0.1, 3).name('X');
        canvasFolder.add(this.app.html3D.billboard1Content.scale, 'y', 0.1, 3).name('Y');


    }

    addVideoToGui(video) {


        this.videoFolder.add(video.model.mesh.position, 'x', -50, 300).name('X');
        this.videoFolder.add(video.model.mesh.position, 'y', -50, 300).name('Y');
        this.videoFolder.add(video.model.mesh.position, 'z', -50, 300).name('Z');
        this.videoFolder.add(video.model.mesh.rotation, 'y', -Math.PI, Math.PI).name('Rotation')
        this.videoFolder.add(video.model.mesh.scale, 'x', 0.1, 3).name('X');
        this.videoFolder.add(video.model.mesh.scale, 'y', 0.1, 3).name('Y');
    }
}






