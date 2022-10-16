import { Controller } from '@/types/controller.interface';
import { Fighter } from './fighter.interface';
import { Renderable } from './renderable.interface';
import { Renderer } from './renderer.interface';
import { Sprite } from './sprite.interface';
import { Timer } from './timer.interface';

export interface User {
  id: number;
  name: string;
  level: number;
  experience: number;
  medals: string[];
  friends: Array<User['id']>;
}

export interface GameContextPlayers {
  fighter: Fighter;
  controller: Controller;
  user: User;
}

export interface GameContextSprites {
  contrast: Renderable;
  reset: Renderable;
  background: Renderable;
  shop: Renderable;
  // remove players from sprites -> need to separate logical components from renderables
  player1: Fighter;
  player2: Fighter;
}

export interface GameContextHtmlElements {
  canvasElement: HTMLCanvasElement | null;
  timerElement: HTMLDivElement | null;
  p1HealthElement: HTMLDivElement | null;
  p2HealthElement: HTMLDivElement | null;
  centerTextElement: HTMLDivElement | null;
}

export interface GameContext {
  canvas: CanvasRenderingContext2D;
  htmlElements: GameContextHtmlElements;
  sprites: GameContextSprites;
  renderer: Renderer;
  timer: Timer;
  players: GameContextPlayers[];

  /**
   * @deprecated The property should not be used
   */
  player1: Fighter;

  /**
   * @deprecated The property should not be used
   */
  player2: Fighter;
}
