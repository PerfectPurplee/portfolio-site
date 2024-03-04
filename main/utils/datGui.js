import {GUI} from "dat.gui";

export class DatGui {

    constructor(app) {
        const gui = new GUI()
        this.app = app;

        const billboardFolder = gui.addFolder('Billboard Position');
        const cameraFolder = gui.addFolder('Camera')

        this.addBillboardToGui(this.billboard1Gui = this.setBillboardGui(40, 0, -16.6, -1.6), billboardFolder, -50, 50, app)
        this.addBillboardToGui(this.billboard2Gui = this.setBillboardGui(46, 0, 1.2, -2.4), billboardFolder, -50, 50, app)
        this.addBillboardToGui(this.billboard3Gui = this.setBillboardGui(27, 0, -28, -1), billboardFolder, -50, 50, app)

        cameraFolder.add(app.camera.position, 'x', -100, 100)
        cameraFolder.add(app.camera.position, 'y', -100, 100)
        cameraFolder.add(app.camera.position, 'z', -100, 100)

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
}






