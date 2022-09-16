import { Config } from "../js/config.js";
import { Context } from "../js/context.js";
import { getHtmlElements } from "../js/utils.js";
import { Timer } from "../js/timer.js";
import { Sprite } from "../js/sprite.js";
import { CommandListener } from "../js/listeners.js";
import { Fighter } from "./new_fighter.js";
import { Renderer } from "../js/renderer.js";
import { Colors } from "../js/globals/vars.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ROUND_TIME,
} from "../js/globals/rules.js";
import { Paint } from "../js/paint.js";

/**
 *
 * @param {{config: Config}} config
 */
export const setup = ({ config }) => {
  const {
    canvasElement,
    timerElement,
    p1HealthElement,
    p2HealthElement,
    centerTextElement,
  } = getHtmlElements();

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

  const player2CommandListener = new CommandListener({
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "ArrowDown",
  });

  const player1 = new Fighter({
    playerName: "Player 1",
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
    playerName: "ROGERIO123",
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

  const timer = new Timer({ timerElement, roundTime: ROUND_TIME });

  return {
    canvas,
    htmlElements: {
      canvasElement,
      timerElement,
      p1HealthElement,
      p2HealthElement,
      centerTextElement,
    },
    sprites: {
      reset,
      background,
      shop,
      contrast,
      player1,
      player2,
    },
    renderer,
    timer,
    player1,
    player2,
  };
};
