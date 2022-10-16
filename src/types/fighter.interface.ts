import { XYCoordinates } from './general-interfaces';
import { InputListener } from './input-listener.interface';
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

export interface FighterParams {
  playerName: string;
  commandListener?: InputListener;
  direction: FighterDirection;
  position: XYCoordinates;
  velocity: XYCoordinates;
  attackBox: Partial<FighterAttackBox>;
  sprites: FighterSprites;
  /** Current {@link Sprite} being rendered/animated on the screen. */
  currentSprite?: Sprite;
  width: number;
  health: number;
  height: number;
}

export interface Fighter extends Required<FighterParams> {
  readonly characterName: string;

  /** state flags */
  isGettingHit: boolean;
  isAttacking: boolean;
  isDying: boolean;
  isDead: boolean;

  /** character attributes */
  jumpVelocity: number;
  runVelocity: number;

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
