import { Controller } from '@/controllers/Controller';
import { Kenji } from '@/fighters/Kenji';
import { Mack } from '@/fighters/Mack';
import { CommandListener } from '@/listeners/CommandListener';
import { GamepadListener } from '@/listeners/GamepadListener';
import { KeyboardListener } from '@/listeners/KeyboardListener';
import { Paint } from '@/renderables/Paint';
import { Sprite } from '@/renderables/Sprite';
import { Config } from '@/types/config.type';
import { GameContext } from '@/types/game-context.interface';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ROUND_TIME } from 'js/globals/rules';
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

  canvasElement.width = CANVAS_WIDTH;
  canvasElement.height = CANVAS_HEIGHT;

  const background = new Sprite({
    canvas: canvas,
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png',
  });

  const shop = new Sprite({
    canvas: canvas,
    position: { x: 600, y: 128 },
    imageSrc: './img/shop_anim.png',
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

  window.addEventListener('gamepadconnected', e => {
    if (!player1GamepadListener.gamepadIndex) {
      player1GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.commands.gamepad[e.gamepad.id] ||
          config.commands.gamepad.default,
      });
      Utils.showControllerConnectedNotification();
    } else if (!player2GamepadListener.gamepadIndex) {
      player2GamepadListener.setGamepad({
        gamepadIndex: e.gamepad.index,
        config:
          config.commands.gamepad[e.gamepad.id] ||
          config.commands.gamepad.default,
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

  const player1 = new Mack({
    commandListener: player1CommandListener,
    playerName: 'Player 1',
    direction: 'right',
    width: 50,
    height: 150,
    health: 100,
    position: {
      x: 0,
      y: 0,
    },
    velocity: { x: 0, y: 0 },
    attackBox: {
      offset: {
        x: 100,
        y: 50,
      },
      width: 150,
      height: 50,
    },
    sprites: {
      idle: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedIdle.png',
          scale: 2.5,
          framesMax: 8,
          animationSpeed: 2,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/idle.png',
          scale: 2.5,
          framesMax: 8,
          animationSpeed: 2,
        }),
      },
      run: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedRun.png',
          scale: 2.5,
          framesMax: 8,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/Run.png',
          scale: 2.5,
          framesMax: 8,
        }),
      },
      jump: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedJump.png',
          scale: 2.5,
          framesMax: 2,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/Jump.png',
          scale: 2.5,
          framesMax: 2,
        }),
      },
      fall: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedFall.png',
          scale: 2.5,
          framesMax: 2,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/Fall.png',
          scale: 2.5,
          framesMax: 2,
        }),
      },
      attack1: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedAttack1.png',
          scale: 2.5,
          framesMax: 6,
          animationSpeed: 3,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/Attack1.png',
          scale: 2.5,
          framesMax: 6,
          animationSpeed: 3,
        }),
      },
      takeHit: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedTakeHitWhiteSilhouette.png',
          scale: 2.5,
          framesMax: 4,
          animationSpeed: 5,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/TakeHitWhiteSilhouette.png',
          scale: 2.5,
          framesMax: 4,
          animationSpeed: 5,
        }),
      },
      death: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/InvertedDeath.png',
          scale: 2.5,
          framesMax: 6,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 157 },
          imageSrc: './img/samuraiMack/Death.png',
          scale: 2.5,
          framesMax: 6,
        }),
      },
    },
  });

  const player2 = new Kenji({
    playerName: 'ROGERIO123',
    commandListener: player2CommandListener,
    direction: 'left',
    width: 50,
    height: 150,
    health: 100,
    position: {
      x: 400,
      y: 100,
    },
    velocity: { x: 0, y: 0 },
    attackBox: {
      offset: {
        x: 100,
        y: 50,
      },
      width: 150,
      height: 50,
    },
    sprites: {
      idle: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Idle.png',
          scale: 2.5,
          framesMax: 4,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedIdle.png',
          scale: 2.5,
          framesMax: 4,
        }),
      },
      run: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Run.png',
          scale: 2.5,
          framesMax: 8,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedRun.png',
          scale: 2.5,
          framesMax: 8,
        }),
      },
      jump: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Jump.png',
          scale: 2.5,
          framesMax: 2,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedJump.png',
          scale: 2.5,
          framesMax: 2,
        }),
      },
      fall: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Fall.png',
          scale: 2.5,
          framesMax: 2,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedFall.png',
          scale: 2.5,
          framesMax: 2,
        }),
      },
      attack1: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Attack1.png',
          scale: 2.5,
          framesMax: 4,
          animationSpeed: 2.5,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedAttack1.png',
          scale: 2.5,
          framesMax: 4,
          animationSpeed: 2.5,
        }),
      },
      takeHit: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/TakeHit.png',
          scale: 2.5,
          framesMax: 3,
          animationSpeed: 3,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedTakeHit.png',
          scale: 2.5,
          framesMax: 3,
          animationSpeed: 3,
        }),
      },
      death: {
        left: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/Death.png',
          scale: 2.5,
          framesMax: 7,
        }),
        right: new Sprite({
          position: null!,
          canvas,
          offset: { x: 215, y: 167 },
          imageSrc: './img/kenji/InvertedDeath.png',
          scale: 2.5,
          framesMax: 7,
        }),
      },
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
