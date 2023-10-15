import {ThreeGraphics} from "./main/application.js";
import {CannonPhysics} from "./main/physicsworld.js";

const graphics = new ThreeGraphics();
const physics = new CannonPhysics(graphics.scene);
//
// animate();
//
// function animate() {
//     requestAnimationFrame(animate)
//     graphics.update()
//     physics.update()
//
// }