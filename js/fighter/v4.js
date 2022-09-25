import {
  GRAVITY,
  FLOOR_Y,
  STARTING_HEALTH_POINTS,
  CEILING_Y,
  LEFT_BORDER_X,
  RIGHT_BORDER_X,
} from "../globals/rules.js";
import { CommandListener } from "../listener/CommandListener.js";
import { Sprite } from "../renderable/sprite.js";

/**
 * Classic first implementation of the Figher Class
 */
export class Fighter {
  /**
   *
   * @param {{playerName: string, commandListener: CommandListener, direction: "left" | "right", position: {x: number, y: number}, velocity: {x: number, y: number}, sprites: Sprite[], attackBox: { offset: { x: number, y: number }, width: number | undefine, height: number | undefine }}} params
   */
  constructor({
    playerName,
    commandListener,
    direction = "right",
    position,
    velocity,
    sprites,
    attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
  }) {
    this.playerName = playerName;
    this.direction = direction;
    this.position = position;
    this.sprites = sprites;

    Object.entries(this.sprites).forEach(([name, variations]) =>
      Object.entries(variations).forEach(
        ([variation, sprite]) => (sprite.position = this.position)
      )
    );
    this.sprites.current = this.sprites.idle[direction];

    this.velocity = velocity;

    // height and width are used by engine for collision detection
    this.height = 150;
    this.width = 50;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };

    this.health = STARTING_HEALTH_POINTS;
    this.isDying - false;
    this.isGettingHit = false;
    this.isAttacking = false;
    this.dead = false;

    this.controls = {
      left: 0,
      right: 0,
    };

    this.commandListener = commandListener;
    this.listenCommands(this.commandListener);
  }

  listenCommands(commandListener) {
    commandListener.on(
      "left",
      this.startRunningLeft.bind(this),
      this.stopRunningLeft.bind(this)
    );
    commandListener.on(
      "right",
      this.startRunningRight.bind(this),
      this.stopRunningRight.bind(this)
    );
    commandListener.on("jump", this.jump.bind(this));
    commandListener.on("attack", this.attack.bind(this));
  }

  startRunningLeft() {
    this.controls.left = 5;
  }

  stopRunningLeft() {
    this.controls.left = 0;
  }

  startRunningRight() {
    this.controls.right = 5;
  }

  stopRunningRight() {
    this.controls.right = 0;
  }

  jump() {
    this.velocity.y = -13;
  }

  attack() {
    this.isAttacking = true;
  }

  start() {
    this.commandListener.start();
  }

  stop() {
    this.commandListener.stop();
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
            this.sprites.current.offset.x * 0.6 +
            this.sprites.current.image.width / this.sprites.current.framesMax >
          RIGHT_BORDER_X
        ? RIGHT_BORDER_X +
          this.sprites.current.offset.x * 0.6 -
          this.sprites.current.image.width / this.sprites.current.framesMax
        : this.position.x;
  }

  updateAttackPosition() {
    if (this.direction === "right") {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    } else {
      this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    }
  }

  applyGravity() {
    if (this.position.y + 150 + this.velocity.y >= FLOOR_Y) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += GRAVITY;
    }
  }

  update() {
    if (this.dead) {
      this.sprites.current.draw();
      return;
    }
    this.sprites.current.update();
    this.updatePlayerPosition();
    this.updateAttackPosition();
    this.applyGravity();
    this.updateMovement();
  }

  takeHit() {
    this.health -= 20;
    if (this.health <= 0) {
      this.isDying = true;
    } else {
      this.isGettingHit = true;
    }
  }

  canSwitchSprite() {
    /**
     * these animations should be interrupted! (dead, attakcing, taking hit)
     * do not allow to change animation if:
     **/

    // is dead
    if (
      this.sprites.current.image === this.sprites.death[this.direction].image
    ) {
      if (
        this.sprites.current.framesCurrent ===
        this.sprites.death[this.direction].framesMax - 1
      ) {
        this.isDying = false;
        this.dead = true;
      }
      return false;
    }

    // is attacking
    if (
      this.sprites.current.image === this.sprites.attack1[this.direction].image
    ) {
      if (
        this.sprites.current.framesCurrent <
        this.sprites.attack1[this.direction].framesMax - 1
      ) {
        return false;
      } else {
        this.isAttacking = false;
      }
    }

    // is taking hit
    if (
      this.sprites.current.image === this.sprites.takeHit[this.direction].image
    ) {
      if (
        this.sprites.current.framesCurrent <
        this.sprites.takeHit[this.direction].framesMax - 1
      ) {
        return false;
      } else {
        this.isGettingHit = false;
      }
    }

    // otherwise allow
    return true;
  }

  updateMovement() {
    if (!this.canSwitchSprite()) return;

    if (this.dead) {
      return;
    }

    //priorities: isDying > Hit > Attacking > Jumping > Running > Idle

    if (this.isDying) {
      return this.switchSprite("death");
    }

    if (this.isGettingHit) {
      return this.switchSprite("takeHit");
    }

    if (this.isAttacking) {
      return this.switchSprite("attack1");
    }

    if (this.velocity.y < 0) {
      return this.switchSprite("jump");
    }

    if (this.velocity.y > 0) {
      return this.switchSprite("fall");
    }

    if (this.velocity.x !== 0) {
      return this.switchSprite("run");
    }
    return this.switchSprite("idle");
  }

  /**
   * Should be *IDEMPOTENT*
   * @param {"idle"|"run"|"jump"|"fall"|"attack1"|"takeHit"|"death"} sprite
   */
  switchSprite(sprite) {
    if (this.sprites.current !== this.sprites[sprite][this.direction]) {
      this.sprites.current = this.sprites[sprite][this.direction];
      this.sprites.current.framesCurrent = 0;
    }
  }

  hasPendingAnimation() {
    return Boolean(this.isAttacking || this.isGettingHit || this.isDying);
  }
}
