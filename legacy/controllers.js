import { Fighter } from "../fighter/v4.js";
import { CommandListener } from "../listeners.js";

export class GamepadListener {
  ignore = () => void 0;
  constructor() {
    this.gamepads = {};
    this.gamepadConnectionListener =
      this.gamepadConnectedEventHandler.bind(this);
    this.gamepadDisconnectionListener =
      this.gamepadDisconnectedEventHandler.bind(this);

    this.listeners = {
      gamepadConnected: this.ignore,
      gamepadDisconnected: this.ignore,
    };
  }

  /**
   *
   * @param {GamepadEvent} event
   */
  gamepadConnectedEventHandler(event) {
    this.gamepads[event.gamepad.index] = event.gamepad;
    this.listeners.gamepadConnected(event.gamepad);
  }

  /**
   *
   * @param {GamepadEvent} event
   */
  gamepadDisconnectedEventHandler(event) {
    delete this.gamepads[event.gamepad.index];
    this.listeners.gamepadDisconnected(event.gamepad);
  }

  /**
   * Handles gamepad connections
   * @callback GamepadListenerEventHandler
   * @param {{gamepad:Gamepad}} params
   */

  /**
   *
   * @param {"gamepadConnected"|"gamepadDisconnected"} event
   * @param {GamepadListenerEventHandler} handler
   */
  on(event, handler) {
    this.listeners[event] = handler;
  }

  start() {
    window.addEventListener("gamepadconnected", this.gamepadConnectionListener);
    window.addEventListener(
      "gamepaddisconnected",
      this.gamepadDisconnectionListener
    );
  }

  stop() {
    window.removeEventListener(
      "gamepadconnected",
      this.gamepadConnectionListener
    );
    window.removeEventListener(
      "gamepaddisconnected",
      this.gamepadDisconnectionListener
    );
  }
}

export class GamepadReader {
  /**
   *
   * @param {{gamepad: Gamepad}} params
   */
  constructor({ gamepad, config } = {}) {
    this.load({ gamepad, config });
  }

  load({ gamepad, config }) {
    this.device = gamepad;
    this.config = config;
  }

  get left() {
    return Boolean(this.gamepad?.buttons?.[this.config?.left]?.pressed);
  }

  get right() {
    return Boolean(this.gamepad?.buttons?.[this.config?.right]?.pressed);
  }

  get jump() {
    return Boolean(this.gamepad?.buttons?.[this.config?.jump]?.pressed);
  }

  get attack() {
    return Boolean(this.gamepad?.buttons?.[this.config?.attack]?.pressed);
  }
}

export class Controller {
  /**
   *
   * @param {{commandListener: CommandListener, fighter: Fighter}} params
   */
  constructor({ commandListener, fighter }) {
    this.commandListener = commandListener;
    this.fighter = fighter;

    this.keys = {
      jump: {
        released: true,
      },
      attack: {
        released: true,
      },
    };

    this.commandListener.on(
      "jump",
      this.handleKeyPressJump.bind(this),
      this.handleKeyReleaseJump.bind(this)
    );
  }

  // on press

  handleKeyPressLeft() {
    this.fighter.startRunningLeft();
  }

  handleKeyPressRight() {
    this.fighter.startRunningRight();
  }

  handleKeyPressJump() {
    if (this.keys.jump.released) {
      this.fighter.jump();
    }
    this.keys.jump.released = false;
  }

  handleKeyPressAttack() {
    if (this.keys.attack.released) {
      this.fighter.attack();
    }
    this.keys.attack.released = false;
  }

  // on release

  handleKeyReleaseLeft() {
    this.fighter.stopRunningLeft();
  }

  handleKeyReleaseRight() {
    this.fighter.stopRunningRight();
  }

  handleKeyReleaseJump() {
    this.keys.jump.released = true;
  }

  handleKeyReleaseAttack() {
    this.keys.attack.released = true;
  }
}
