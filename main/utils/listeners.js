const eventListenersBuilder = () => {
    let moveRight = false
    let moveLeft = false
    let moveForward = false
    let moveBackward = false

    return {
        moveRight, moveLeft, moveForward, moveBackward,

        setResizeEventListener(camera, renderer) {
            window.addEventListener('resize', (event) => {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
            })
        },
        setOnPointerMoveListener(pointer)  {
            window.addEventListener('pointermove', (event) => {
                pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
                console.log(pointer.x)
            })
        },
        setKeyDownEventListener  ()  {
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
        },
        setKeyUPEventListener()  {
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

    }
}


export default eventListenersBuilder


