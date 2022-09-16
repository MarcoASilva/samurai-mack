import { InputListener } from "./InputListener.js";

export class CommandListener extends InputListener {
  /**
   *
   * @param {{sources: InputListener[]}} params
   */
  constructor({ sources }) {
    super();

    this.sources = sources;

    this.sources.forEach((source) => {
      Object.keys(this.listeners).forEach((key) => {
        source.on(
          key,
          () => this._propagate({ command: key, event: "press" }),
          () => this._propagate({ command: key, event: "release" })
        );
      });
    });
  }

  start() {
    this.sources.forEach((input) => input.start());
  }

  stop() {
    this.sources.forEach((input) => input.stop());
  }

  /**
   *
   * @param {{command: "left"|"right"|"jump"|"attack", event: "press"|"release"}} params
   */
  _propagate({ command, event }) {
    this.listeners[command][event]();
  }
}
