import { Config } from './types/config.type';
import { Fighter } from './types/fighter.interface';
import { GameContext } from './types/game-context.interface';
import { GameEngine, setup as _setup } from '@core';

export type GameEvent = 'load' | 'start' | 'pause' | 'resume' | 'end';

export type GameEventHandler<T> = (
  params: T extends 'end'
    ? { context: GameContext; winner: Fighter }
    : T extends 'start' | 'pause'
    ? { context: GameContext }
    : never,
) => void;

export type GameEventListeners = Record<GameEvent, GameEventHandler<GameEvent>>;

export const ignore: GameEventHandler<GameEvent> = () => void 0;

export type Plugin = (context: GameContext) => GameContext;

class Game {
  private config: Config;
  private listeners: GameEventListeners = {
    load: ignore,
    start: ignore,
    pause: ignore,
    resume: ignore,
    end: ignore,
  };
  private plugins: Plugin[] = [];
  engine: GameEngine;
  context: GameContext;

  private animationFrameRequest: number;

  constructor(config: Config) {
    this.config = config;
    this.engine = new GameEngine(_setup(config));

    /** Attach listeners */
    this.engine.on('end', this.onEnd.bind(this));
    this.engine.on('pause', this.onPause.bind(this));
    this.engine.on('resume', this.onResume.bind(this));

    this.listeners.load({ context: this.engine.context });
  }

  private onPause(): void {
    console.info(`[i] Game paused.`);
    this.listeners.pause({ context: this.engine.context });
  }

  private onResume(): void {
    console.info(`[i] Game resumed.`);
    this.listeners.resume({ context: this.engine.context });
  }

  private onEnd({ winner }: { winner: Fighter }): void {
    console.info(`[i] Game ended: [Winner: ${winner.playerName}]`);
    this.engine.stop();
    window.cancelAnimationFrame(this.animationFrameRequest);
  }

  private loop(): void {
    this.plugins.forEach(
      plugin => (this.engine.context = plugin(this.engine.context)),
    );
    this.animationFrameRequest = window.requestAnimationFrame(
      this.loop.bind(this),
    );
    this.engine.tick();
  }

  on(event: GameEvent, handler: GameEventHandler<GameEvent>): boolean {
    if (this.listeners[event]) {
      return (this.listeners[event] = handler), true;
    }
    return false;
  }

  start(): void {
    if (this.engine.state !== GameEngine.states.New) {
      throw new Error('Cannot start a Game that is already in progress');
    }
    this.engine.start();
    this.animationFrameRequest = window.requestAnimationFrame(
      this.loop.bind(this),
    );
    this.listeners.start({ context: this.context });
  }

  stop(
    { continueRendering }: { continueRendering?: boolean } = {
      continueRendering: false,
    },
  ): void {
    if (this.engine.state === GameEngine.states.Stopped) {
      return console.warn('Game is already stopped.');
    }
    if (this.engine.state === GameEngine.states.New) {
      return console.warn('Game has not started yet.');
    }
    this.engine.stop({ continueRendering });
  }

  reset(config?: Config): void {
    if (this.engine.state !== GameEngine.states.Stopped) {
      throw new Error('Game must be stopped in order to reset.');
    }
    this.engine.context = _setup(config ?? this.config);
  }

  /**
   * Registers Plugin and returns its position. You can use `position` to match against unregistered Plugins later if needed.
   *
   * Plugins registered by ´register´ method run **every** frame.
   * Make sure your plugin logic is well designed, otherwise the game may have its performance degraded (FPS)
   *
   * **Important**: Duplication is allowed, therefore plugins are executed in the same order they were added
   * and their position is returned to uniquely identify them in case they need to be unregistered.
   *
   * @param plugin
   * @returns index of the registered Plugin
   */
  register(plugin: Plugin): number {
    return this.plugins.push(plugin) - 1;
  }

  /**
   * Unregisters Plugin and returns the position of the unregistered plugin.
   *
   * @param plugin
   * @returns index of the unregistered Plugin
   */
  unregister(plugin: Plugin): number {
    const i = this.plugins.indexOf(plugin);
    if (i >= 0) {
      this.plugins.splice(i, 1);
    }
    return i;
  }
}

export const setup = (config: Config): Game => {
  return new Game(config);
};