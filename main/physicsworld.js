

export class CannonPhysics {

    scene;

    constructor(ThreeScene) {



    }

    update = () => {
        this.physicsWorld.fixedStep();
        this.cannonDebugger.update();
    }
}