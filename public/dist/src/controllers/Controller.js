export class Controller {
    constructor({ commandListener, fighter }) {
        this.keys = {
            jump: {
                released: true,
            },
            attack: {
                released: true,
            },
        };
        this.commands = {
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
        this.commandListener = commandListener;
        this.fighter = fighter;
        Object.keys(this.commands).forEach((command) => this.commandListener.on(command, this.commands[command].press.bind(this), this.commands[command].release.bind(this)));
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
    // exposed controls
    sendCommand(command) {
        this.commands[command].press(command);
    }
    releaseCommand(command) {
        this.commands[command].release(command);
    }
    /** **IMPORTANT:** this method goes over all the rules and forces the movement */
    forceLeft() {
        this.fighter.stopRunningRight();
        this.fighter.startRunningLeft();
    }
    /** **IMPORTANT:** this method goes over all the rules and forces the movement */
    forceRight() {
        this.fighter.stopRunningLeft();
        this.fighter.startRunningRight();
    }
    /** **IMPORTANT:** this method goes over all the rules and forces the movement */
    forceJump() {
        this.fighter.jump();
    }
    /** **IMPORTANT:** this method goes over all the rules and forces the movement */
    forceAttack() {
        this.fighter.isAttacking = false;
        this.fighter.attack();
    }
}
