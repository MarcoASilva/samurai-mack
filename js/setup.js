import { Config } from "./core/config.js";
import { Context } from "./core/context.js";
import {
  getHtmlElements,
  showControllerConnectedNotification,
  showControllerDisconnectedNotification,
} from "./utils.js";
import { Timer } from "./core/timer.js";
import { Sprite } from "./renderable/sprite.js";
import { KeyboardListener } from "./listener/KeyboardListener.js";
import { GamepadListener } from "./listener/GamepadListener.js";
import { CommandListener } from "./listener/CommandListener.js";
import { Fighter } from "./fighter/v4.js";
import { Renderer } from "./core/renderer.js";
import { Colors } from "./globals/vars.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, ROUND_TIME } from "./globals/rules.js";
import { Paint } from "./renderable/paint.js";
import { Controller } from "./controller/controller.js";

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

  const player1KeyboardListener = new KeyboardListener({
    left: "a",
    right: "d",
    jump: "w",
    attack: " ",
  });

  const player2KeyboardListener = new KeyboardListener({
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "ArrowDown",
  });

  const gamepads = navigator.getGamepads().filter(Boolean);

  gamepads.forEach((_) => showControllerConnectedNotification());

  const player1GamepadListener = new GamepadListener({
    gamepadIndex: gamepads[0]?.index ?? null,
    config:
      config.commands.gamepad[gamepads[0]?.id] ||
      config.commands.gamepad.default,
  });

  const player2GamepadListener = new GamepadListener({
    gamepadIndex: gamepads[1]?.index ?? null,
    config:
      config.commands.gamepad[gamepads[0]?.id] ||
      config.commands.gamepad.default,
  });

  const player1CommandListener = new CommandListener({
    sources: [player1KeyboardListener, player1GamepadListener],
  });
  const player2CommandListener = new CommandListener({
    sources: [player2KeyboardListener, player2GamepadListener],
  });

  window.addEventListener("gamepadconnected", (e) => {
    if (!player1GamepadListener.gamepadIndex) {
      player1GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.commands.gamepad[e.gamepad.id] ||
          config.commands.gamepad.default,
      });
      showControllerConnectedNotification();
    } else if (!player2GamepadListener.gamepadIndex) {
      player2GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.commands.gamepad[e.gamepad.id] ||
          config.commands.gamepad.default,
      });
      showControllerConnectedNotification();
    } else {
      console.info(
        "Gamepad Connected [not attached] (both players already have a connected gamepad)"
      );
    }
  });
  window.addEventListener("gamepaddisconnected", (e) => {
    showControllerDisconnectedNotification();
    if (e.gamepad.index === player1GamepadListener.gamepadIndex) {
      console.info("Player 1 Gamepad Disconnected");
      player1GamepadListener.gamepadIndex = null;
    } else if (e.gamepad.index === player2GamepadListener.gamepadIndex) {
      console.info("Player 2 Gamepad Disconnected");
      player2GamepadListener.gamepadIndex = null;
    } else {
      console.info("Gamepad Disconnected (Not attached to any Player)");
    }
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

  const player1Controller = new Controller({
    commandListener: player1CommandListener,
    fighter: player1,
  });
  const player2Controller = new Controller({
    commandListener: player2CommandListener,
    fighter: player2,
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
    players: [
      {
        controller: player1Controller,
        fighter: player1,
      },
      {
        controller: player2Controller,
        fighter: player2,
      },
    ],
  };
};
