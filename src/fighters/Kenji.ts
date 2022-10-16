import {
  Fighter,
  FighterAttackBox,
  FighterDirection,
  FighterParams,
  FighterSprites,
} from '@/types/fighter.interface.js';
import { XYCoordinates } from '@/types/general-interfaces.js';
import { InputListener } from '@/types/input-listener.interface.js';
import { Sprite } from '@/types/sprite.interface.js';
import {
  GRAVITY,
  FLOOR_Y,
  STARTING_HEALTH_POINTS,
  CEILING_Y,
  LEFT_BORDER_X,
  RIGHT_BORDER_X,
} from '../../js/globals/rules.js';

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

export class Kenji implements Fighter {
  readonly characterName: 'Kenji';

  playerName: string;
  position: XYCoordinates;
  direction: FighterDirection;
  velocity: XYCoordinates;
  attackBox: FighterAttackBox;
  commandListener: InputListener;
  sprites: FighterSprites;
  currentSprite: Sprite;

  // height and width are used by engine for collision detection
  /** Fighter's height. Internally fighter is represented by a rectangle. */
  height: number;
  /** Fighter's height. Internally fighter is represented by a rectangle. */
  width: number;

  /** Fighter's current HP */
  health: number;

  // CHARACTER ATTRIBUTES!
  jumpVelocity: number = -13;
  runVelocity: number = 5;

  // state flags
  isGettingHit = false;
  isAttacking = false;
  isDying = false;
  isDead = false;

  private controls: { left: number; right: number } = {
    left: 0,
    right: 0,
  };

  constructor({
    playerName,
    commandListener,
    direction = 'right',
    position,
    velocity,
    sprites,
    attackBox,
    currentSprite,
    height,
    width,
    health,
  }: FighterParams) {
    this.playerName = playerName;
    this.direction = direction;
    this.position = position;
    this.sprites = sprites;

    Object.entries(this.sprites).forEach(([name, variations]) =>
      Object.entries(variations).forEach(
        ([variation, sprite]) => (sprite.position = this.position),
      ),
    );
    this.currentSprite = currentSprite ?? this.sprites.idle[direction];

    this.velocity = velocity;

    // height and width are used by engine for collision detection
    this.height = height || 150;
    this.width = width || 50;

    this.health = health || STARTING_HEALTH_POINTS;

    this.attackBox = {
      position: attackBox.position ?? {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset ?? {
        x: 0,
        y: 0,
      },
      width: attackBox.width ?? 150,
      height: attackBox.height ?? 50,
    };

    this.commandListener = commandListener;
    this.listenCommands(this.commandListener);
  }

  listenCommands(commandListener) {
    commandListener.on(
      'left',
      this.startRunningLeft.bind(this),
      this.stopRunningLeft.bind(this),
    );
    commandListener.on(
      'right',
      this.startRunningRight.bind(this),
      this.stopRunningRight.bind(this),
    );
    commandListener.on('jump', this.jump.bind(this));
    commandListener.on('attack', this.attack.bind(this));
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
    if (this.currentSprite.image === this.sprites.death[this.direction].image) {
      if (
        this.currentSprite.framesCurrent ===
        this.sprites.death[this.direction].framesMax - 1
      ) {
        this.isDying = false;
        this.isDead = true;
      }
      return false;
    }

    // is attacking
    if (
      this.currentSprite.image === this.sprites.attack1[this.direction].image
    ) {
      if (
        this.currentSprite.framesCurrent <
        this.sprites.attack1[this.direction].framesMax - 1
      ) {
        return false;
      } else {
        this.isAttacking = false;
      }
    }

    // is taking hit
    if (
      this.currentSprite.image === this.sprites.takeHit[this.direction].image
    ) {
      if (
        this.currentSprite.framesCurrent <
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
