import { Fighter } from "../fighter/v4.js";
import { CommandListener } from "../listener/CommandListener.js";

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
