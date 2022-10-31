import { Hud } from 'src/core/Hud';
import { Controller } from '../types/controller.interface';
import { Fighter } from './fighter.interface';
import { LogicalComponent } from './logical-component.interface';
import { Renderable } from './renderable.interface';

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
  components: LogicalComponent[];
  players: GameContextPlayers[];
  hud: Hud;
}
