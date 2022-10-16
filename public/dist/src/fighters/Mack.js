import { GRAVITY, FLOOR_Y, STARTING_HEALTH_POINTS, CEILING_Y, LEFT_BORDER_X, RIGHT_BORDER_X, } from '../../js/globals/rules.js';
const DEFAULTS = {
    attackbox: {
        position: {
            x: 0,
            y: 0,
        },
        offset: {
            x: 0,
            y: 0,
        },
        width: 150,
        height: 50,
    },
    width: 50,
    height: 150,
    health: 100,
};
export class Mack {
    constructor({ playerName, commandListener, direction = 'right', position, velocity, sprites, attackBox, currentSprite, height, width, health, }) {
        var _a, _b, _c, _d;
        // CHARACTER ATTRIBUTES!
        this.jumpVelocity = -13;
        this.runVelocity = 5;
        // state flags
        this.isGettingHit = false;
        this.isAttacking = false;
        this.isDying = false;
        this.isDead = false;
        this.controls = {
            left: 0,
            right: 0,
        };
        this.playerName = playerName;
        this.direction = direction;
        this.position = position;
        this.sprites = sprites;
        // bind sprites positions to fighters position
        Object.entries(this.sprites).forEach(([name, variations]) => Object.entries(variations).forEach(([variation, sprite]) => (sprite.position = this.position)));
        this.currentSprite = currentSprite !== null && currentSprite !== void 0 ? currentSprite : this.sprites.idle[direction];
        this.velocity = velocity;
        // height and width are used by engine for collision detection
        this.height = height || 150;
        this.width = width || 50;
        this.health = health || STARTING_HEALTH_POINTS;
        this.attackBox = {
            position: (_a = attackBox.position) !== null && _a !== void 0 ? _a : {
                x: this.position.x,
                y: this.position.y,
            },
            offset: (_b = attackBox.offset) !== null && _b !== void 0 ? _b : {
                x: 0,
                y: 0,
            },
            width: (_c = attackBox.width) !== null && _c !== void 0 ? _c : 150,
            height: (_d = attackBox.height) !== null && _d !== void 0 ? _d : 50,
        };
        if (commandListener) {
            this.commandListener = commandListener;
            this.listenCommands(this.commandListener);
        }
    }
    listenCommands(commandListener) {
        commandListener.on('left', this.startRunningLeft.bind(this), this.stopRunningLeft.bind(this));
        commandListener.on('right', this.startRunningRight.bind(this), this.stopRunningRight.bind(this));
        commandListener.on('jump', this.jump.bind(this));
        commandListener.on('attack', this.attack.bind(this));
    }
    startRunningLeft() {
        this.controls.left = this.runVelocity;
    }
    stopRunningLeft() {
        this.controls.left = 0;
    }
    startRunningRight() {
        this.controls.right = this.runVelocity;
    }
    stopRunningRight() {
        this.controls.right = 0;
    }
    jump() {
        this.velocity.y = this.jumpVelocity;
    }
    attack() {
        this.isAttacking = true;
    }
    start() {
        var _a;
        (_a = this.commandListener) === null || _a === void 0 ? void 0 : _a.start();
    }
    stop() {
        var _a;
        (_a = this.commandListener) === null || _a === void 0 ? void 0 : _a.stop();
        this.controls.left = 0;
        this.controls.right = 0;
    }
    updatePlayerPosition() {
        this.position.y += this.velocity.y;
        this.position.y = this.position.y < CEILING_Y ? CEILING_Y : this.position.y;
        this.velocity.x = this.controls.right - this.controls.left;
        this.position.x += this.velocity.x;
        this.position.x =
            this.position.x < LEFT_BORDER_X
                ? LEFT_BORDER_X
                : this.position.x -
                    this.currentSprite.offset.x * 0.6 +
                    this.currentSprite.image.width / this.currentSprite.framesMax >
                    RIGHT_BORDER_X
                    ? RIGHT_BORDER_X +
                        this.currentSprite.offset.x * 0.6 -
                        this.currentSprite.image.width / this.currentSprite.framesMax
                    : this.position.x;
    }
    updateAttackPosition() {
        if (this.direction === 'right') {
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        }
        else {
            this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        }
    }
    applyGravity() {
        if (this.position.y + 150 + this.velocity.y >= FLOOR_Y) {
            this.velocity.y = 0;
            this.position.y = 330;
        }
        else {
            this.velocity.y += GRAVITY;
        }
    }
    update() {
        if (this.isDead) {
            this.currentSprite.draw();
            return;
        }
        this.currentSprite.update();
        this.updatePlayerPosition();
        this.updateAttackPosition();
        this.applyGravity();
        this.updateMovement();
    }
    takeHit() {
        this.health -= 20;
        if (this.health <= 0) {
            this.isDying = true;
        }
        else {
            this.isGettingHit = true;
        }
    }
    canSwitchSprite() {
        /**
         * these animations should be interrupted! (dead, attakcing, taking hit)
         * do not allow to change animation if:
         **/
        // is dead
        if (this.currentSprite.image === this.sprites.death[this.direction].image) {
            if (this.currentSprite.framesCurrent ===
                this.sprites.death[this.direction].framesMax - 1) {
                this.isDying = false;
                this.isDead = true;
            }
            return false;
        }
        // is attacking
        if (this.currentSprite.image === this.sprites.attack1[this.direction].image) {
            if (this.currentSprite.framesCurrent <
                this.sprites.attack1[this.direction].framesMax - 1) {
                return false;
            }
            else {
                this.isAttacking = false;
            }
        }
        // is taking hit
        if (this.currentSprite.image === this.sprites.takeHit[this.direction].image) {
            if (this.currentSprite.framesCurrent <
                this.sprites.takeHit[this.direction].framesMax - 1) {
                return false;
            }
            else {
                this.isGettingHit = false;
            }
        }
        // otherwise allow
        return true;
    }
    updateMovement() {
        if (!this.canSwitchSprite())
            return;
        if (this.isDead) {
            return;
        }
        //priorities: isDying > Hit > Attacking > Jumping > Running > Idle
        if (this.isDying) {
            return this.switchSprite('death');
        }
        if (this.isGettingHit) {
            return this.switchSprite('takeHit');
        }
        if (this.isAttacking) {
            return this.switchSprite('attack1');
        }
        if (this.velocity.y < 0) {
            return this.switchSprite('jump');
        }
        if (this.velocity.y > 0) {
            return this.switchSprite('fall');
        }
        if (this.velocity.x !== 0) {
            return this.switchSprite('run');
        }
        return this.switchSprite('idle');
    }
    /**
     * Should be *IDEMPOTENT*
     * @param {"idle"|"run"|"jump"|"fall"|"attack1"|"takeHit"|"death"} sprite
     */
    switchSprite(sprite) {
        if (this.currentSprite !== this.sprites[sprite][this.direction]) {
            this.currentSprite = this.sprites[sprite][this.direction];
            this.currentSprite.framesCurrent = 0;
        }
    }
    hasPendingAnimation() {
        return Boolean(this.isAttacking || this.isGettingHit || this.isDying);
    }
}
