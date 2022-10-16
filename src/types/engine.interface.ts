import { Fighter } from './fighter.interface';
import { GameContext } from './game-context.interface';

export type EngineEvent = 'pause' | 'end' | 'resume';
export type EngineState = 'New' | 'Started' | 'Stopped';

export type EngineEventHandler<T> = (
  params: T extends 'end' ? { winner: Fighter } : never,
) => void;

export interface EngineParams {
  context: GameContext;
}

export interface GameResult {
  winner: Fighter | null;
}

export interface Engine {
  context: GameContext;
  state: EngineState;
  /** Start engine! */
  start(): void;
  /**
   * Stop engine.
   * @param continueRendering defaults to true (set to false to also stop rendering animations)
   */
  stop(params: { continueRendering?: boolean }): void;
  /**
   * Compute next state. Basically all the game happens in here frame-by-frame.
   * The more `ticks` you can call per second basically represents your FPS rate.
   *
   * Tick does basically three steps:
   *
   * - Check against game rules
   * - Compute next frame
   * - Animate
   */
  tick(): void;
  /** Stop engine, declare winner and emits "end" event. */
  endGame(): void;
  /** Register for Engine events. */
  on(event: EngineEvent, handler: EngineEventHandler<EngineEvent>): void;
}
