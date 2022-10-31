import { Config } from './config.type';
import { XYCoordinates } from './general-interfaces';
import { InputListener } from './input-listener.interface';
import { LogicalComponent } from './logical-component.interface';
import { Sprite } from './sprite.interface';

export type FighterAnimationType =
  | 'idle'
  | 'run'
  | 'jump'
  | 'fall'
  | 'attack1'
  | 'takeHit'
  | 'death';

export type FighterDirection = 'left' | 'right';
export interface FighterAttackBox {
  position: XYCoordinates;
  offset: XYCoordinates;
  width: number;
  height: number;
}

export type FighterSprites = {
  [key in FighterAnimationType]: Record<FighterDirection, Sprite>;
};

export type Character = keyof Omit<Config['character'], 'all'>;

export enum CharacterType {
  Kenji = 'kenji',
  Mack = 'mack',
}

export interface FighterParams {
  config: Config;
  canvas: CanvasRenderingContext2D;
  character: Character;
  playerName: string;
  direction: FighterDirection;
  position: XYCoordinates;
  health?: number;
  width?: number;
  height?: number;
  velocity?: XYCoordinates;
  attackBox?: Partial<FighterAttackBox>;
  sprites?: FighterSprites;
  /** Current {@link Sprite} being rendered/animated on the screen. */
  currentSprite?: Sprite;
  commandListener?: InputListener;
}

export interface CharacterAttributes {
  jumpVelocity: number;
  runVelocity: number;
  maxHealth: number;
}

export interface Fighter
  extends LogicalComponent,
    Required<Omit<FighterParams, 'config' | 'canvas'>> {
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
  takeHit(): void;
  start(): void;
  stop(): void;
  update(): void;
  hasPendingAnimation(): boolean;
}
