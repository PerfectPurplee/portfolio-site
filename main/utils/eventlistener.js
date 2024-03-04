
export class Eventlisteners {

    moveRight;
    moveLeft;
    moveForward;
    moveBackward;

    constructor(app) {
        this.app = app

        this.moveRight = false;
        this.moveLeft = false;
        this.moveForward = false;
        this.moveBackward = false;

        this.setKeyDownEventListener()
        this.setKeyUPEventListener()
        // this.setResizeEventListener(app)
        // this.setOnPointerMoveEventListener(app)

    }


    setKeyDownEventListener = () => {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }

            console.log(event.code)
        })
    }

    setKeyUPEventListener = () => {
        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = false;

                    break;
                case 'KeyS':
                    this.moveBackward = false;

                    break;
                case 'KeyA':
                    this.moveLeft = false;

                    break;
                case 'KeyD':
                    this.moveRight = false;

                    break;
            }
            console.log(event.code)
        })
    }
    setResizeEventListener = (app) => {
        window.addEventListener('resize', (event) => {
            app.onWindowResize()
        })
    }

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    setOnPointerMoveEventListener = (app) => {


    }


}