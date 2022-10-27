import { Fighter } from '../fighters/Fighter';
import { CharacterType } from '../types/fighter.interface';
import { Controller } from '../controllers/Controller';
import { CommandListener } from '../listeners/CommandListener';
import { GamepadListener } from '../listeners/GamepadListener';
import { KeyboardListener } from '../listeners/KeyboardListener';
import { Paint } from '../renderables/Paint';
import { Sprite } from '../renderables/Sprite';
import { Config } from '../types/config.type';
import { GameContext } from '../types/game-context.interface';
import { Renderer } from './Renderer';
import { Timer } from './Timer';
import { Utils } from './Utils';

export const setup = (config: Config): GameContext => {
  const {
    canvasElement,
    timerElement,
    p1HealthElement,
    p2HealthElement,
    centerTextElement,
  } = Utils.getHtmlElements();

  const canvas = canvasElement.getContext('2d');

  canvasElement.width = config.canvas.width;
  canvasElement.height = config.canvas.height;

  const background = new Sprite({
    canvas: canvas,
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png',
    scale: 1,
  });

  const shop = new Sprite({
    canvas: canvas,
    position: { x: 600, y: 128 },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6,
  });

  const player1KeyboardListener = new KeyboardListener({
    left: 'a',
    right: 'd',
    jump: 'w',
    attack: ' ',
  });

  const player2KeyboardListener = new KeyboardListener({
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    attack: 'ArrowDown',
  });

  const gamepads = navigator.getGamepads().filter(Boolean);

  gamepads.forEach(_ => Utils.showControllerConnectedNotification());

  const player1GamepadListener = new GamepadListener({
    gamepadIndex: gamepads[0]?.index ?? null,
    config:
      config.controls.gamepads[gamepads[0]?.id] ||
      config.controls.gamepads.default,
  });

  const player2GamepadListener = new GamepadListener({
    gamepadIndex: gamepads[1]?.index ?? null,
    config:
      config.controls.gamepads[gamepads[1]?.id] ||
      config.controls.gamepads.default,
  });

  const player1CommandListener = new CommandListener({
    sources: [player1KeyboardListener, player1GamepadListener],
  });
  const player2CommandListener = new CommandListener({
    sources: [player2KeyboardListener, player2GamepadListener],
  });

  window.addEventListener('gamepadconnected', e => {
    if (!player1GamepadListener.gamepadIndex) {
      player1GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.controls.gamepads[e.gamepad.id] ||
          config.controls.gamepads.default,
      });
      Utils.showControllerConnectedNotification();
    } else if (!player2GamepadListener.gamepadIndex) {
      player2GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.controls.gamepads[e.gamepad.id] ||
          config.controls.gamepads.default,
      });
      Utils.showControllerConnectedNotification();
    } else {
      console.info(
        'Gamepad Connected [not attached] (both players already have a connected gamepad)',
      );
    }
  });
  window.addEventListener('gamepaddisconnected', e => {
    Utils.showControllerDisconnectedNotification();
    if (e.gamepad.index === player1GamepadListener.gamepadIndex) {
      console.info('Player 1 Gamepad Disconnected');
      player1GamepadListener.gamepadIndex = null;
    } else if (e.gamepad.index === player2GamepadListener.gamepadIndex) {
      console.info('Player 2 Gamepad Disconnected');
      player2GamepadListener.gamepadIndex = null;
    } else {
      console.info('Gamepad Disconnected (Not attached to any Player)');
    }
  });

  const player1 = new Fighter({
    commandListener: player1CommandListener,
    config,
    canvas,
    character: CharacterType.Mack,
    playerName: 'Player 1',
    direction: 'right',
    position: {
      x: 0,
      y: 0,
    },
  });

  const player2 = new Fighter({
    commandListener: player2CommandListener,
    character: CharacterType.Kenji,
    playerName: 'ROGERIO123',
    direction: 'left',
    config,
    canvas,
    position: {
      x: 400,
      y: 100,
    },
  });

  const player1Controller = new Controller({
    commandListener: player1CommandListener,
    fighter: player1,
  });
  const player2Controller = new Controller({
    commandListener: player2CommandListener,
    fighter: player2,
  });

  const reset = new Paint({
    canvas: canvas,
    color: 'black',
    x: 0,
    y: 0,
    width: 1024,
    height: 576,
  });

  const contrast = new Paint({
    canvas: canvas,
    color: 'rgba(255,255,255, 0.15)',
    x: 0,
    y: 0,
    width: 1024,
    height: 576,
  });

  const renderer = new Renderer({
    sprites: [reset, background, shop, contrast, player1, player2],
  });

  const timer = new Timer({
    timerElement,
    roundTime: config.game.roundTime,
  });

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
        user: null!,
      },
      {
        controller: player2Controller,
        fighter: player2,
        user: null!,
      },
    ],
  };
};
