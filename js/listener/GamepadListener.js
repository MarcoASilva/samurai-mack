import { InputListener } from "./InputListener.js";

export class GamepadListener extends InputListener {
  ignore = () => void 0;

  /**
   *
   * @param {{config: {left: number, right: number, jump: number, attack: number}, gamepadIndex: number}} params
   */
  constructor({
    config: { left = -1, right = -2, jump = -3, attack = -4 },
    gamepadIndex,
  }) {
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

    // codigo feito com pressa
    // seria bom refatorar
    this.axisXState = {
      current: 0,
      previous: 0,
    };
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

  /**
   * Sets the index in navigator.getGamepads which is located the gamepad to listen for commands
   * @param {{config: {left: number, right: number, jump: number, attack: number}, gamepadIndex: number}} params
   */
  setGamepad({ gamepadIndex, config }) {
    this.gamepadIndex = gamepadIndex;
    if (config) {
      Object.keys(this.commands).forEach(
        (key) => (this.commands[key] = config[key])
      );
    }
    console.log(
      "New Gamepad set:",
      gamepadIndex,
      this.gamepad.id,
      this.gamepad
    );
  }

  _readButtons() {
    Object.assign(this.state.previous, this.state.current);

    this.axisXState.previous = this.axisXState.current;
    this.axisXState.current = Math.round((this.gamepad?.axes?.[0] || 0) * 100);

    this.state.current.left = Boolean(
      this.gamepad?.buttons?.[this.commands?.left]?.pressed || this.AxisX < 50
    );
    this.state.current.right = Boolean(
      this.gamepad?.buttons?.[this.commands?.right]?.pressed || this.AxisX < -50
    );
    this.state.current.jump = Boolean(
      this.gamepad?.buttons?.[this.commands?.jump]?.pressed
    );
    this.state.current.attack = Boolean(
      this.gamepad?.buttons?.[this.commands?.attack]?.pressed
    );

    Object.entries(this.state.previous).forEach(([key, value]) => {
      if (!value && this.state.current[key]) {
        this.listeners[key].press();
      }
      if (value && !this.state.current[key]) {
        this.listeners[key].release();
      }
      if (this.axisXState.current > 50) {
        this.listeners.right.press();
      }
      if (this.axisXState.current < -50) {
        this.listeners.left.press();
      }
      if (this.axisXState.previous > 50 && this.axisXState.current < 50) {
        this.listeners.right.release();
      }
      if (this.axisXState.previous < -50 && this.axisXState.current > -50) {
        this.listeners.left.release();
      }
      // other changes does not matter now:
      // pressed => pressed
      // released => released
    });

    this.readButtonsRequestId = window.requestAnimationFrame(
      this._readButtons.bind(this)
    );
  }

  _stopReadingButtons() {
    window.cancelAnimationFrame(this.readButtonsRequestId);
  }
}
