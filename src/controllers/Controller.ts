import {
  Controller as ControllerInterface,
  ControllerParams,
} from '../types/controller.interface';
import { Fighter } from '../types/fighter.interface';
import { Command } from '../types/general-interfaces';
import {
  InputListener,
  InputListenerCallbacks,
} from '../types/input-listener.interface';

interface ControllerKeys {
  jump: {
    released: boolean;
  };
  attack: {
    released: boolean;
  };
}

export class Controller implements ControllerInterface {
  commandListener: InputListener;
  fighter: Fighter;

  private keys: ControllerKeys = {
    jump: {
      released: true,
    },
    attack: {
      released: true,
    },
  };

  private commands: Record<Command, InputListenerCallbacks> = {
    left: {
      press: this.handleKeyPressLeft,
      release: this.handleKeyReleaseLeft,
    },
    right: {
      press: this.handleKeyPressRight,
      release: this.handleKeyReleaseRight,
    },
    attack: {
      press: this.handleKeyPressAttack,
      release: this.handleKeyReleaseAttack,
    },
    jump: {
      press: this.handleKeyPressJump,
      release: this.handleKeyReleaseJump,
    },
  };

  constructor({ commandListener, fighter }: ControllerParams) {
    this.commandListener = commandListener;
    this.fighter = fighter;

    Object.keys(this.commands).forEach((command: Command) =>
      this.commandListener.on(
        command,
        this.commands[command].press.bind(this),
        this.commands[command].release.bind(this),
      ),
    );
  }

  // on press

  private handleKeyPressLeft() {
    this.fighter.startRunningLeft();
  }

  private handleKeyPressRight() {
    this.fighter.startRunningRight();
  }

  private handleKeyPressJump() {
    if (this.keys.jump.released) {
      this.fighter.jump();
    }
    this.keys.jump.released = false;
  }

  private handleKeyPressAttack() {
    if (this.keys.attack.released) {
      this.fighter.attack();
    }
    this.keys.attack.released = false;
  }

  // on release

  private handleKeyReleaseLeft() {
    this.fighter.stopRunningLeft();
  }

  private handleKeyReleaseRight() {
    this.fighter.stopRunningRight();
  }

  private handleKeyReleaseJump() {
    this.keys.jump.released = true;
  }

  private handleKeyReleaseAttack() {
    this.keys.attack.released = true;
  }

  // exposed controls

  sendCommand(command: Command): void {
    this.commands[command].press(command);
  }

  releaseCommand(command: Command): void {
    this.commands[command].release(command);
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceLeft(): void {
    this.fighter.stopRunningRight();
    this.fighter.startRunningLeft();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceRight(): void {
    this.fighter.stopRunningLeft();
    this.fighter.startRunningRight();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceJump(): void {
    this.fighter.jump();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceAttack(): void {
    this.fighter.isAttacking = false;
    this.fighter.attack();
  }
}
