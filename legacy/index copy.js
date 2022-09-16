import {
  determineWinner,
  getHtmlElements,
  rectangularCollition,
} from "../js/utils.js";
import { Timer } from "../js/timer.js";
import { Sprite } from "../js/sprite.js";
import { CommandListener } from "../js/listeners.js";
import { Fighter } from "./js/new_fighter.js";
import { Renderer } from "../js/renderer.js";
import { Colors } from "../js/globals/vars.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../js/globals/rules.js";
import { Paint } from "../js/paint.js";

const { canvasElement, timerElement, p1HealthElement, p2HealthElement } =
  getHtmlElements();

const canvas = canvasElement.getContext("2d");

canvasElement.width = CANVAS_WIDTH;
canvasElement.height = CANVAS_HEIGHT;

const background = new Sprite({
  canvas: canvas,
  position: { x: 0, y: 0 },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  canvas: canvas,
  position: { x: 600, y: 128 },
  imageSrc: "./img/shop_anim.png",
  scale: 2.75,
  framesMax: 6,
});

const player1CommandListener = new CommandListener({
  left: "a",
  right: "d",
  jump: "w",
  attack: " ",
});

// const player1CommandListener = new CommandListener(config.command.player1);

const player2CommandListener = new CommandListener({
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  attack: "ArrowDown",
});

const player1 = new Fighter({
  canvas: canvas,
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 0 },
  imageSrc: "./img/samuraiMack/idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/idle.png",
      scale: 2.5,
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      scale: 2.5,
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      scale: 2.5,
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      scale: 2.5,
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      scale: 2.5,
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/TakeHitWhiteSilhouette.png",
      scale: 2.5,
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/death.png",
      scale: 2.5,
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  commandListener: player1CommandListener,
});

const player2 = new Fighter({
  canvas: canvas,
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
  imageSrc: "./img/kenji/idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: { x: 215, y: 167 },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/idle.png",
      scale: 2.5,
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      scale: 2.5,
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      scale: 2.5,
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      scale: 2.5,
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      scale: 2.5,
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/TakeHit.png",
      scale: 2.5,
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/death.png",
      scale: 2.5,
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 150,
    height: 50,
  },
  commandListener: player2CommandListener,
});

const reset = new Paint({ canvas: canvas, color: Colors.Reset });
const contrast = new Paint({ canvas: canvas, color: Colors.Contrast });

const renderer = new Renderer({
  sprites: [reset, background, shop, contrast, player1, player2],
});

const timer = new Timer({ timerElement, roundTime: 60 });

player1CommandListener.start();
player2CommandListener.start();

let animationRequest;

/**
 *
 * @param {{animationRequest: number, commandListeners: CommandListener[]}} param0
 */
const endGame = ({ animationRequest, commandListeners }) => {
  // window.cancelAnimationFrame(animationRequest);
  // commandListeners.forEach((cmdL) => cmdL.stop());
  console.log("GAME ENDED!");
};

function animate() {
  animationRequest = window.requestAnimationFrame(animate);

  renderer.update();

  // player.velocity.x = 0;
  // enemy.velocity.x = 0;

  // player movement ----->> MOVE THIS TO FIGHTER CLASS and follow PRIORITIES
  // if (keys.a.pressed && player.lastKey === "a") {
  //   player.velocity.x = -5;
  //   player.switchSprite("run");
  // } else if (keys.d.pressed && player.lastKey === "d") {
  //   player.switchSprite("run");
  //   player.velocity.x = 5;
  // } else {
  //   player.switchSprite("idle");
  // }

  // if (player.velocity.y < 0) {
  //   player.switchSprite("jump");
  // } else if (player.velocity.y > 0) {
  //   player.switchSprite("fall");
  // }

  // enemy movement
  // if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
  //   enemy.switchSprite("run");
  //   enemy.velocity.x = -5;
  // } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
  //   enemy.switchSprite("run");
  //   enemy.velocity.x = 5;
  // } else {
  //   enemy.switchSprite("idle");
  // }

  // if (enemy.velocity.y < 0) {
  //   enemy.switchSprite("jump");
  // } else if (enemy.velocity.y > 0) {
  //   enemy.switchSprite("fall");
  // }

  // detect for collision and enemy gets hit
  if (
    rectangularCollition({ rectangle1: player1, rectangle2: player2 }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player2.takeHit();
    player1.isAttacking = false;
    gsap.to(p2HealthElement, { width: `${player2.health}%` });
    console.log("player1 collision detected");
  }

  // if (player.isAttacking && player.framesCurrent === 4) {
  //   player.isAttacking = false;
  // }

  // detect for collision
  if (
    rectangularCollition({ rectangle1: player2, rectangle2: player1 }) &&
    player2.isAttacking &&
    player2.framesCurrent === 2
  ) {
    player1.takeHit();
    player2.isAttacking = false;
    gsap.to(p1HealthElement, { width: `${player1.health}%` });
    console.log("player2 collision detected");
  }

  // end game based on health
  if (player1.health < 0 || player2.health < 0) {
    determineWinner({ player1, player2 });
    timer.stop();
    player1.stop();
    player2.stop();
    player1.commandListener.stop();
    player2.commandListener.stop();
    endGame({
      animationRequest,
      // commandListeners: [player1CommandListener, player2CommandListener],
    });
  }
}

animationRequest = window.requestAnimationFrame(animate);

timer
  .run()
  .then(determineWinner.bind(determineWinner, { player1, player2 }))
  .then(() => {
    player1.stop();
    player2.stop();
    player1.commandListener.stop();
    player2.commandListener.stop();
  })
  .finally(
    endGame.bind(endGame, {
      animationRequest,
      // commandListeners: [player1CommandListener, player2CommandListener],
    })
  );
