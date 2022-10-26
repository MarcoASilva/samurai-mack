import { Command } from '../types/general-interfaces';
import { InputListener } from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';

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

export class GamepadListener extends BaseListener implements InputListener {
  gamepadIndex: number;
  commands: KeyboardCommands;
  state: CommandStateDiff;
  readButtonsRequestId: number;
  axisXValue: number;

  constructor({
    config: { left = -1, right = -2, jump = -3, attack = -4 },
    gamepadIndex,
  }: GamepadListenerParams) {
    super();

    this.gamepadIndex = gamepadIndex;

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

  start() {
    this._readButtons();
  }

  stop() {
    this._stopReadingButtons();
  }

  get gamepad() {
    return navigator.getGamepads()[this.gamepadIndex];
  }

  setGamepad({ gamepadIndex, config }: GamepadListenerParams) {
    this.gamepadIndex = gamepadIndex;
    if (config) {
      Object.keys(this.commands).forEach(
        key => (this.commands[key] = config[key]),
      );
    }
    console.info(
      'New Gamepad set:',
      gamepadIndex,
      this.gamepad.id,
      this.gamepad,
    );
  }

  _readButtons() {
    Object.assign(this.state.previous, this.state.current);

    this.axisXValue = Math.round((this.gamepad?.axes?.[0] || 0) * 100);

    this.state.current.left = Boolean(
      this.gamepad?.buttons?.[this.commands?.left]?.pressed ||
        this.axisXValue < 50,
    );
    this.state.current.right = Boolean(
      this.gamepad?.buttons?.[this.commands?.right]?.pressed ||
        this.axisXValue < -50,
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

        // if (this.axisXState.current > 50) {
        //   this.listeners.right.press();
        // }
        // if (this.axisXState.current < -50) {
        //   this.listeners.left.press();
        // }
        // if (this.axisXState.previous > 50 && this.axisXState.current < 50) {
        //   this.listeners.right.release();
        // }
        // if (this.axisXState.previous < -50 && this.axisXState.current > -50) {
        //   this.listeners.left.release();
        // }

        // other changes does not matter now:
        // pressed => pressed
        // released => released
      },
    );

    this.readButtonsRequestId = window.requestAnimationFrame(
      this._readButtons.bind(this),
    );
  }

  _stopReadingButtons() {
    window.cancelAnimationFrame(this.readButtonsRequestId);
  }
}
