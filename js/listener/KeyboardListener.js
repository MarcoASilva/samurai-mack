import { InputListener } from "./InputListener.js";

export class KeyboardListener extends InputListener {
  ignore = () => void 0;

  /**
   *
   * @param {{left: string, right: string, jump: string, attack: string}} params
   */
  constructor({ left = "", right = "", jump = "", attack = "" }) {
    super();

    this.commands = {
      [left]: "left",
      [right]: "right",
      [jump]: "jump",
      [attack]: "attack",
    };

    this.eventMap = {
      keydown: "press",
      keyup: "release",
    };

    this.listener = this._processInput.bind(this);
  }

  _processInput(event) {
    this.listeners[this.commands[event.key]][this.eventMap[event.type]]();
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
}
