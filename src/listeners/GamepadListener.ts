import { Command } from '../types/general-interfaces';
import {
  InputSource,
  RawListener,
  SourceType,
} from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';
import { RawGamepadListener } from './RawGamepadListener';

type KeyboardCommands = {
  [key in Command]: number;
};

type CommandState = {
  [key in Command]: boolean;
};

type CommandStateDiff = {
  previous: CommandState;
  current: CommandState;
};

export interface GamepadListenerParams {
  config: KeyboardCommands;
  gamepadIndex: number;
}

export class GamepadListener extends BaseListener implements InputSource {
  type = SourceType.Gamepad;
  gamepadIndex: number;
  commands: KeyboardCommands;
  state: CommandStateDiff;
  readButtonsRequestId: number;
  axisXValue: number;
  raw: RawListener<SourceType.Gamepad>;

  constructor({
    config: { left = -1, right = -2, jump = -3, attack = -4 },
    gamepadIndex,
  }: GamepadListenerParams) {
    super();

    this.gamepadIndex = gamepadIndex;

    this.raw = new RawGamepadListener({ gamepadIndex });

    this.commands = {
      left,
      right,
      jump,
      attack,
    };

    this.state = {
      previous: {
        left: false,
        right: false,
        jump: false,
        attack: false,
      },
      current: {
        left: false,
        right: false,
        jump: false,
        attack: false,
      },
    };

    this.axisXValue = 0;

    this.readButtonsRequestId;
  }

  get gamepad() {
    return navigator.getGamepads()[this.gamepadIndex];
  }

  private readButtons() {
    Object.assign(this.state.previous, this.state.current);

    this.axisXValue = Math.round(this.gamepad?.axes?.[0] * 100);

    this.state.current.left = Boolean(
      this.gamepad?.buttons?.[this.commands?.left]?.pressed ||
        this.axisXValue < -50,
    );
    this.state.current.right = Boolean(
      this.gamepad?.buttons?.[this.commands?.right]?.pressed ||
        this.axisXValue > 50,
    );
    this.state.current.jump = Boolean(
      this.gamepad?.buttons?.[this.commands?.jump]?.pressed,
    );
    this.state.current.attack = Boolean(
      this.gamepad?.buttons?.[this.commands?.attack]?.pressed,
    );

    Object.entries(this.state.previous).forEach(
      ([key, value]: [Command, boolean]) => {
        if (!value && this.state.current[key]) {
          this.listeners[key].press(key);
        }
        if (value && !this.state.current[key]) {
          this.listeners[key].release(key);
        }
      },
    );

    this.raw.read();

    this.readButtonsRequestId = window.requestAnimationFrame(
      this.readButtons.bind(this),
    );
  }

  private stopReadingButtons() {
    window.cancelAnimationFrame(this.readButtonsRequestId);
  }

  start() {
    this.readButtons();
  }

  stop() {
    this.stopReadingButtons();
  }

  setGamepad({ gamepadIndex, config }: GamepadListenerParams) {
    this.gamepadIndex = gamepadIndex;
    if (config) {
      Object.keys(this.commands).forEach(
        key => (this.commands[key] = config[key]),
      );
    }
    this.raw.setGamepadIndex(gamepadIndex);
    console.info(
      'New Gamepad set:',
      gamepadIndex,
      this.gamepad.id,
      this.gamepad,
    );
  }
}
