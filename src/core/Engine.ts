import { gsap } from 'gsap';
import {
  Engine,
  EngineEvent,
  EngineEventHandler,
  EngineState,
} from '../types/engine.interface';
import { Fighter } from '../types/fighter.interface';
import { GameContext } from '../types/game-context.interface';

export interface EngineParams {
  context: GameContext;
}

type EngineEventListeners = {
  [key in EngineEvent]: EngineEventHandler<key>;
};

enum EngineStates {
  New = 'New',
  Started = 'Started',
  Stopped = 'Stopped',
}

enum EngineEvents {
  pause = 'pause',
  end = 'end',
  resume = 'resume',
}

const ignore: EngineEventHandler<any> = () => void 0;

/**
 * Has all the high-level instructions. Responsible for running the game from start to end.
 *
 * Requires GameContext.
 *
 * Strategy: Frame-by-Frame
 */
export class GameEngine implements Engine {
  static readonly STATE: Record<EngineState, EngineState> = EngineStates;
  static readonly EVENT: Record<EngineEvent, EngineEvent> = EngineEvents;
  state: EngineState = GameEngine.STATE.New;

  private steps = [() => void 0];
  private eventListeners: EngineEventListeners = {
    end: ignore,
    pause: ignore,
    resume: ignore,
  };
  private gameResult = {
    winner: null,
  };

  constructor(public context: GameContext) {}

  private emit(event) {
    this.eventListeners[event](this.gameResult);
  }

  private rectangularCollition({
    rectangle1,
    rectangle2,
  }: {
    rectangle1: Fighter;
    rectangle2: Fighter;
  }): boolean {
    if (rectangle1.direction === 'right') {
      return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
          rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
          rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
          rectangle2.position.y &&
        rectangle1.attackBox.position.y <=
          rectangle2.position.y + rectangle2.height
      );
    }

    return (
      rectangle1.attackBox.position.x +
        rectangle1.width -
        rectangle1.attackBox.width <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.position.x >= rectangle2.position.x &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <=
        rectangle2.position.y + rectangle2.height
    );
  }

  private setPlayersDirections() {
    if (
      this.context.players[0].fighter.position.x >
      this.context.players[1].fighter.position.x
    ) {
      this.context.players[0].fighter.direction = 'left';
      this.context.players[1].fighter.direction = 'right';
    } else {
      this.context.players[0].fighter.direction = 'right';
      this.context.players[1].fighter.direction = 'left';
    }
  }

  private checkAttacks() {
    // check if player1 hit player2
    if (
      this.rectangularCollition({
        rectangle1: this.context.players[0].fighter,
        rectangle2: this.context.players[1].fighter,
      }) &&
      this.context.players[0].fighter.isAttacking &&
      this.context.players[0].fighter.currentSprite.framesCurrent === 4
    ) {
      this.context.players[1].fighter.takeHit();
      this.context.players[0].fighter.isAttacking = false;
      gsap.to(this.context.htmlElements.p2HealthElement, {
        width: `${this.context.players[1].fighter.health}%`,
      });
    }

    // check if player2 hit player1
    if (
      this.rectangularCollition({
        rectangle1: this.context.players[1].fighter,
        rectangle2: this.context.players[0].fighter,
      }) &&
      this.context.players[1].fighter.isAttacking &&
      this.context.players[1].fighter.currentSprite.framesCurrent === 2
    ) {
      this.context.players[0].fighter.takeHit();
      this.context.players[1].fighter.isAttacking = false;
      gsap.to(this.context.htmlElements.p1HealthElement, {
        width: `${this.context.players[0].fighter.health}%`,
      });
    }
  }

  private displayWinner() {
    if (this.gameResult.winner) {
      this.context.htmlElements.centerTextElement.innerHTML = `${this.gameResult.winner.playerName} Wins`;
    } else {
      this.context.htmlElements.centerTextElement.innerHTML = 'Tie';
    }
    this.context.htmlElements.centerTextElement.style.display = 'flex';
  }

  private checkPlayersHealth() {
    if (
      this.context.players[0].fighter.health <= 0 ||
      this.context.players[1].fighter.health <= 0
    ) {
      this.endGame();
    }
  }

  private render() {
    this.context.renderer.update();
  }

  private determineResult() {
    if (
      this.context.players[0].fighter.health ===
      this.context.players[1].fighter.health
    ) {
      this.gameResult.winner = null;
    } else if (
      this.context.players[0].fighter.health >
      this.context.players[1].fighter.health
    ) {
      this.gameResult.winner = this.context.players[0].fighter;
    } else if (
      this.context.players[1].fighter.health >
      this.context.players[0].fighter.health
    ) {
      this.gameResult.winner = this.context.players[1].fighter;
    }
  }

  private endAfterAnimationIsComplete() {
    if (
      this.context.players[0].fighter.hasPendingAnimation() ||
      this.context.players[1].fighter.hasPendingAnimation()
    ) {
      return;
    }

    // order here matters as emit('end') can trigger stop indirectly hence updating this.steps = ['render'] before this.steps.splice(this.steps.indexOf(this.endAfterAnimationIsComplete), 1);
    // hence producing this.steps = [] (empty array)
    this.steps.splice(this.steps.indexOf(this.endAfterAnimationIsComplete), 1);
    this.emit('end');
  }

  endGame() {
    this.stop();
    this.determineResult();
    this.displayWinner();
    this.steps.push(this.endAfterAnimationIsComplete);
  }

  start() {
    this.state = GameEngine.STATE.Started;
    this.steps = [
      this.render,
      this.setPlayersDirections,
      this.checkAttacks,
      this.checkPlayersHealth,
    ];
    this.context.players.forEach(p => p.fighter.start());
    this.context.timer.run().then(this.endGame.bind(this));
  }

  stop(
    { continueRendering }: { continueRendering?: boolean } = {
      continueRendering: true,
    },
  ) {
    this.state = GameEngine.STATE.Stopped;
    this.context.timer.stop();
    this.context.players.forEach(p => p.fighter.start());
    if (continueRendering) {
      this.steps = [this.render];
    } else {
      this.steps = [];
    }
  }

  tick() {
    this.steps.forEach(step => step.bind(this)());
  }

  on(event: EngineEvent, handler: EngineEventHandler<EngineEvent>): void {
    this.eventListeners[event] = handler;
  }
}
