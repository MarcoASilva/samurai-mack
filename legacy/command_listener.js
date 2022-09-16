export class CommandListener {
  ignore = () => void 0;

  constructor({ left = "", right = "", jump = "", attack = "" }) {
    // levar para a classe KeyboardListener
    this.commands = {
      [left]: "left",
      [right]: "right",
      [jump]: "jump",
      [attack]: "attack",
    };

    this.listeners = {
      left: {
        keydown: this.ignore,
        keyup: this.ignore,
      },
      right: {
        keydown: this.ignore,
        keyup: this.ignore,
      },
      jump: {
        keydown: this.ignore,
        keyup: this.ignore,
      },
      attack: {
        keydown: this.ignore,
        keyup: this.ignore,
      },
      undefined: {
        keydown: this.ignore,
        keyup: this.ignore,
      },
    };

    // this is needed to keep the reference "this"
    // and to keep the function's reference to be used by stop()
    this.listener = this._processInput.bind(this);
  }

  _processInput(event) {
    this.listeners[this.commands[event.key]][event.type]();
  }

  start() {
    this.listener = this._processInput.bind(this);
    window.addEventListener("keydown", this.listener);
    window.addEventListener("keyup", this.listener);
  }

  stop() {
    window.removeEventListener("keydown", this.listener);
    window.removeEventListener("keyup", this.listener);
  }

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
    // this.listeners[command] = callback;
    this.listeners[command] = {
      keydown: keyPressedCallback,
      keyup: keyReleasedCallback,
    };
  }
}
