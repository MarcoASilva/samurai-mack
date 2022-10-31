import { Config } from './config.type';
import { XYCoordinates } from './general-interfaces';
import { InputListener } from './input-listener.interface';
import { LogicalComponent } from './logical-component.interface';
import { Sprite } from './sprite.interface';

export type CharacterAnimationType =
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'attack1'
  | 'takeHit'
  | 'death';

export type CharacterDirection = 'left' | 'right';
export interface CharacterAttackBox {
  position: XYCoordinates;
  offset: XYCoordinates;
  width: number;
  height: number;
}

export type CharacterSprites = {
  [key in CharacterAnimationType]: Record<CharacterDirection, Sprite>;
};

export type CharacterType = keyof Omit<Config['character'], 'all'>;

export interface CharacterParams {
  config: Config;
  canvas: CanvasRenderingContext2D;
  character: CharacterType;
  playerName: string;
  direction: CharacterDirection;
  position: XYCoordinates;
  health?: number;
  width?: number;
  height?: number;
  velocity?: XYCoordinates;
  attackBox?: Partial<CharacterAttackBox>;
  sprites?: CharacterSprites;
  /** Current {@link Sprite} being rendered/animated on the screen. */
  currentSprite?: Sprite;
  commandListener?: InputListener;
}

export interface CharacterAttributes {
  jumpVelocity: number;
  runVelocity: number;
  maxHealth: number;
  attackPower: number;
}

export interface Character
  extends LogicalComponent,
    Required<Omit<CharacterParams, 'config' | 'canvas'>> {
  /** state flags */
  isGettingHit: boolean;
  isAttacking: boolean;
  isDying: boolean;
  isDead: boolean;

  /** character attributes */
  attributes: CharacterAttributes;

  /** reference values needed for calculations */
  game: Pick<Config['game'], 'gravity'>;
  stage: Config['stage'];

  startRunningLeft(): void;
  stopRunningLeft(): void;
  startRunningRight(): void;
  stopRunningRight(): void;
  jump(): void;
  attack(): void;
  takeHit(damage: number): void;
  start(): void;
  stop(): void;
  update(): void;
  hasPendingAnimation(): boolean;
}
