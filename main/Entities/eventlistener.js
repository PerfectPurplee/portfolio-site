export class Eventlisteners {

    moveRight;
    moveLeft;
    moveForward;
    moveBackward;

    constructor() {
        this.activeKeys = 0;

        this.moveRight = false;
        this.moveLeft = false;
        this.moveForward = false;
        this.moveBackward = false;

        this.setupKeyDownEventListener();
        this.setupKeyUPEventListener();

    }

    setupKeyDownEventListener = () => {
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

    setupKeyUPEventListener = () => {
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
                    this.activeKeys += 1;
                    break;
                case 'KeyD':
                    this.moveRight = false;
                    this.activeKeys += 1;
                    break;
            }
            console.log(event.code)
        })
    }


}