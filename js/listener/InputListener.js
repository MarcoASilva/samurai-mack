export class InputListener {
  ignore = () => void 0;

  /**
   *
   * @param {{left: number, right: string|number, jump: string|number, attack: string|number}} params
   */
  constructor() {
    this.listeners = {
      left: {
        press: this.ignore,
        release: this.ignore,
      },
      right: {
        press: this.ignore,
        release: this.ignore,
      },
      jump: {
        press: this.ignore,
        release: this.ignore,
      },
      attack: {
        press: this.ignore,
        release: this.ignore,
      },
      undefined: {
        press: this.ignore,
        release: this.ignore,
      },
    };
  }

  /**
   * Start listening for inputs
   * @abstract
   */
  start() {
    throw new Error("start is not implemented!");
  }

  /**
   * Stop listening for inputs
   * @abstract
   */
  stop() {
    throw new Error("start is not implemented!");
  }

  /**
   *
   * @param {"left"|"right"|"jump"|"attack"} command
   * @param {*} keyPressedCallback
   * @param {*} keyReleasedCallback
   */
  on(
    command,
    keyPressedCallback = this.ignore,
    keyReleasedCallback = this.ignore
  ) {
    if (!Object.keys(this.listeners).includes(command)) {
      console.warn(
        `Registered listener for UNEXISTING COMMAND: ${command}. Available commands to listen to are: ${Object.keys(
          this.listeners
        )}`
      );
    }
    this.listeners[command] = {
      press: keyPressedCallback,
      release: keyReleasedCallback,
    };
  }
}
