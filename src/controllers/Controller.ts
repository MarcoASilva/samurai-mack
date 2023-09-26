import {
  Controller as ControllerInterface,
  ControllerParams,
} from '../types/controller.interface';
import { Character } from '../types/character.interface';
import { Command } from '../types/general-interfaces';
import {
  CommandListener,
  InputListenerCallbacks,
  SourceType,
} from '../types/input-listener.interface';

interface ControllerKeys {
  jump: {
    released: boolean;
  };
  attack: {
    released: boolean;
  };
}

export class Controller<T extends SourceType> implements ControllerInterface {
  commandListener: CommandListener;
  character: Character;

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

  constructor({ commandListener, character }: ControllerParams) {
    this.commandListener = commandListener;
    this.character = character;

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
    this.character.startRunningLeft();
  }

  private handleKeyPressRight() {
    this.character.startRunningRight();
  }

  private handleKeyPressJump() {
    if (this.keys.jump.released) {
      this.character.jump();
    }
    this.keys.jump.released = false;
  }

  private handleKeyPressAttack() {
    if (this.keys.attack.released) {
      this.character.attack();
    }
    this.keys.attack.released = false;
  }

  // on release

  private handleKeyReleaseLeft() {
    this.character.stopRunningLeft();
  }

  private handleKeyReleaseRight() {
    this.character.stopRunningRight();
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
    this.character.stopRunningRight();
    this.character.startRunningLeft();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceRight(): void {
    this.character.stopRunningLeft();
    this.character.startRunningRight();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceJump(): void {
    this.character.jump();
  }

  /** **IMPORTANT:** this method goes over all the rules and forces the movement */
  forceAttack(): void {
    this.character.isAttacking = false;
    this.character.attack();
  }
}
