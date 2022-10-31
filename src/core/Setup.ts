import { Character } from '../components/Character';
import { CharacterType } from '../types/character.interface';
import { Controller } from '../controllers/Controller';
import { CommandListener } from '../listeners/CommandListener';
import { GamepadListener } from '../listeners/GamepadListener';
import { KeyboardListener } from '../listeners/KeyboardListener';
import { Config } from '../types/config.type';
import { GameContext } from '../types/game-context.interface';
import { Utils } from './Utils';
import { Scenario } from '../components/Scenario';
import { Hud } from './Hud';

export const setup = (config: Config): GameContext => {
  const { canvasElement } = Utils.getHtmlElements();

  const canvas = canvasElement.getContext('2d');

  canvasElement.width = config.canvas.width;
  canvasElement.height = config.canvas.height;

  const scenario = new Scenario(config, canvas);
  const hud = new Hud({ config });

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

  const player1 = new Character({
    commandListener: player1CommandListener,
    config,
    canvas,
    character: 'mack',
    playerName: 'Player 1',
    direction: 'right',
    position: {
      x: 0,
      y: 0,
    },
  });

  const player2 = new Character({
    commandListener: player2CommandListener,
    character: 'kenji',
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
    character: player1,
  });
  const player2Controller = new Controller({
    commandListener: player2CommandListener,
    character: player2,
  });

  return {
    canvas,
    hud,
    components: [scenario, player1, player2],
    players: [
      {
        controller: player1Controller,
        character: player1,
        user: null!,
      },
      {
        controller: player2Controller,
        character: player2,
        user: null!,
      },
    ],
  };
};
