import {
  GRAVITY,
  FLOOR_Y,
  STARTING_HEALTH_POINTS,
  CEILING_Y,
  LEFT_BORDER_X,
  RIGHT_BORDER_X,
} from "../globals/rules.js";
import { Sprite } from "../renderable/sprite.js";

/**
 * Classic first implementation of the Figher Class
 */
export class Fighter extends Sprite {
  constructor({
    canvas,
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined },
    commandListener,
    playerName,
  }) {
    super({ canvas, position, imageSrc, scale, framesMax, offset });

    this.velocity = velocity;
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
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    this.playerName = playerName;
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
    // if (this.playerName === "Player 1") {
    //   console.log("START left");
    // }
    this.controls.left = 5;
  }

  stopRunningLeft() {
    // if (this.playerName === "Player 1") {
    //   console.log("STOP left");
    // }
    this.controls.left = 0;
  }

  startRunningRight() {
    // if (this.playerName === "Player 1") {
    //   console.log("START right");
    // }
    this.controls.right = 5;
  }

  stopRunningRight() {
    // if (this.playerName === "Player 1") {
    //   console.log("STOP right");
    // }
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
            this.offset.x * 0.6 +
            this.image.width / this.framesMax >
          RIGHT_BORDER_X
        ? RIGHT_BORDER_X +
          this.offset.x * 0.6 -
          this.image.width / this.framesMax
        : this.position.x;
  }

  updateAttackPosition() {
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
  }

  applyGravity() {
    if (this.position.y + this.height + this.velocity.y >= FLOOR_Y) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += GRAVITY;
    }
  }

  update() {
    this.draw();

    if (this.dead) return;

    this.animateFrames();
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
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.isDying = false;
        this.dead = true;
      }
      return false;
    }

    // is attacking
    if (this.image === this.sprites.attack1.image) {
      if (this.framesCurrent < this.sprites.attack1.framesMax - 1) {
        return false;
      } else {
        this.isAttacking = false;
      }
    }

    // is taking hit
    if (this.image === this.sprites.takeHit.image) {
      if (this.framesCurrent < this.sprites.takeHit.framesMax - 1) {
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
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.idle.scale;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.run.scale;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.jump.scale;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.fall.scale;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.attack1.scale;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.takeHit.scale;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
          this.scale = this.sprites.death.scale;
        }
        break;
    }
  }

  hasPendingAnimation() {
    return Boolean(this.isAttacking || this.isGettingHit || this.isDying);
  }
}
