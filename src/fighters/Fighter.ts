import {
  Character,
  CharacterAttributes,
  Fighter as FighterInterface,
  FighterAnimationType,
  FighterAttackBox,
  FighterDirection,
  FighterParams,
  FighterSprites,
} from '../types/fighter.interface';
import { XYCoordinates } from '../types/general-interfaces';
import { InputListener } from '../types/input-listener.interface';
import { Sprite as SpriteInterface } from '../types/sprite.interface';
import { Sprite } from '../renderables/Sprite';
import { Config } from '../types/config.type';

export class Fighter implements FighterInterface {
  character: Character;
  playerName: string;
  position: XYCoordinates;
  direction: FighterDirection;
  velocity: XYCoordinates;
  attackBox: FighterAttackBox;
  commandListener: InputListener;
  sprites: FighterSprites = {
    attack1: { left: null, right: null },
    death: { left: null, right: null },
    fall: { left: null, right: null },
    idle: { left: null, right: null },
    jump: { left: null, right: null },
    run: { left: null, right: null },
    takeHit: { left: null, right: null },
  };
  currentSprite: SpriteInterface;

  health: number;

  // height and width are used by engine for collision detection
  /** Fighter's height. Internally fighter is represented by a rectangle. */
  height: number;
  /** Fighter's height. Internally fighter is represented by a rectangle. */
  width: number;

  // CHARACTER ATTRIBUTES!
  attributes: CharacterAttributes;

  game: Pick<Config['game'], 'gravity'>;
  stage: Config['stage'];

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
    config,
    canvas,
    character,
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
    this.character = character;
    this.playerName = playerName;
    this.direction = direction;
    this.position = position;
    this.health = health ?? config.character[this.character].maxHealth ?? 100;

    // height and width are used by engine for collision detection
    this.height = height ?? config.character[this.character].height ?? 150;
    this.width = width ?? config.character[this.character].width ?? 50;

    this.attackBox = {
      position: attackBox?.position ?? {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox?.offset ??
        config.character[this.character].attackBox.offset ?? {
          x: 0,
          y: 0,
        },
      width:
        attackBox?.width ??
        config.character[this.character].attackBox.width ??
        150,
      height:
        attackBox?.height ??
        config.character[this.character].attackBox.height ??
        50,
    };

    this.velocity = velocity ??
      config.character[this.character].velocity ?? { x: 0, y: 0 };

    this.game = { gravity: config.game.gravity };
    this.stage = { ...config.stage };

    this.loadAttributes(config);

    if (sprites) {
      this.sprites = sprites;
      this.bindSpritesPosition();
    } else {
      this.loadSprites({ config, canvas });
    }

    this.currentSprite = currentSprite ?? this.sprites.idle[direction];

    if (commandListener) {
      this.commandListener = commandListener;
      this.listenCommands(this.commandListener);
    }

    this.listenCommands(this.commandListener);
  }

  loadAttributes(config: Config) {
    this.attributes = {
      jumpVelocity: config.character[this.character].jumpVelocity ?? -10,
      runVelocity: config.character[this.character].runVelocity ?? 5,
      maxHealth: config.character[this.character].maxHealth ?? 100,
    };
  }

  loadSprites({
    config,
    canvas,
  }: {
    config: Config;
    canvas: CanvasRenderingContext2D;
  }) {
    Object.entries(this.sprites).forEach(
      ([name, variations]: [
        FighterAnimationType,
        Record<FighterDirection, Sprite>,
      ]) =>
        Object.entries(variations).forEach(
          ([variation]: [FighterDirection, Sprite]) => {
            this.sprites[name][variation] = new Sprite({
              ...config.character[this.character].sprites[name][variation],
              position: this.position,
              canvas: canvas,
            });
          },
        ),
    );
  }

  bindSpritesPosition() {
    Object.entries(this.sprites).forEach(([name, variations]) =>
      Object.entries(variations).forEach(
        ([variation, sprite]) => (sprite.position = this.position),
      ),
    );
  }

  listenCommands(commandListener: InputListener) {
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
    this.controls.left = this.attributes.runVelocity;
  }

  stopRunningLeft() {
    this.controls.left = 0;
  }

  startRunningRight() {
    this.controls.right = this.attributes.runVelocity;
  }

  stopRunningRight() {
    this.controls.right = 0;
  }

  jump() {
    this.velocity.y = this.attributes.jumpVelocity;
  }

  attack() {
    this.isAttacking = true;
  }

  start() {
    this.commandListener?.start();
  }

  stop() {
    this.commandListener?.stop();
    this.controls.left = 0;
    this.controls.right = 0;
  }

  updatePlayerPosition() {
    this.position.y += this.velocity.y;
    this.position.y =
      this.position.y < this.stage.ceilingY
        ? this.stage.ceilingY
        : this.position.y;

    this.velocity.x = this.controls.right - this.controls.left;
    this.position.x += this.velocity.x;
    this.position.x =
      this.position.x < this.stage.leftBorderX
        ? this.stage.leftBorderX
        : this.position.x -
            this.currentSprite.offset.x * 0.6 +
            this.currentSprite.image.width / this.currentSprite.framesMax >
          this.stage.rightBorderX
        ? this.stage.rightBorderX +
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
    if (this.position.y + this.height + this.velocity.y >= this.stage.floorY) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += this.game.gravity;
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
