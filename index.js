import config from "./config/index.js";
import { setup } from "./js/setup.js";
import { GameEngine } from "./js/engine.js";

const context = setup({ config });
const engine = new GameEngine({ context });

let animationRequest;

function animate() {
  animationRequest = window.requestAnimationFrame(animate);
  engine.tick();
}

engine.start();
engine.on("end", ({ winner }) => {
  console.log(winner);
  engine.stop({ continueRendering: false });
  setTimeout(() => {
    if (confirm("Restart?")) {
      engine.context = setup({ config });
      engine.start();
    } else {
      window.cancelAnimationFrame(animationRequest);
    }
  }, 1000);
});

animationRequest = window.requestAnimationFrame(animate);
