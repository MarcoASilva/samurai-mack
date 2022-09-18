import { Context } from "./core/context.js";
import { Fighter } from "./fighter/v4.js";

export class GameEngine {
  /**
   *
   * @param {{context: Context}} params
   */
  constructor({ context }) {
    this.context = context;
    this.eventListeners = {
      end: () => {},
    };
    this.gameResult = {
      winner: null,
    };
    this.steps = [() => void 0];
  }

  rectangularCollition({ rectangle1, rectangle2 }) {
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

  checkAttacks() {
    // check if player1 hit player2
    if (
      this.rectangularCollition({
        rectangle1: this.context.player1,
        rectangle2: this.context.player2,
      }) &&
      this.context.player1.isAttacking &&
      this.context.player1.sprites.current.framesCurrent === 4
    ) {
      this.context.player2.takeHit();
      this.context.player1.isAttacking = false;
      gsap.to(this.context.htmlElements.p2HealthElement, {
        width: `${this.context.player2.health}%`,
      });
    }

    // check if player2 hit player1
    if (
      this.rectangularCollition({
        rectangle1: this.context.player2,
        rectangle2: this.context.player1,
      }) &&
      this.context.player2.isAttacking &&
      this.context.player2.sprites.current.framesCurrent === 2
    ) {
      this.context.player1.takeHit();
      this.context.player2.isAttacking = false;
      gsap.to(this.context.htmlElements.p1HealthElement, {
        width: `${this.context.player1.health}%`,
      });
    }
  }

  displayWinner() {
    if (this.gameResult.winner) {
      this.context.htmlElements.centerTextElement.innerHTML = `${this.gameResult.winner.playerName} Wins`;
    } else {
      this.context.htmlElements.centerTextElement.innerHTML = "Tie";
    }
    this.context.htmlElements.centerTextElement.style.display = "flex";
  }

  checkPlayersHealth() {
    if (this.context.player1.health <= 0 || this.context.player2.health <= 0) {
      this.endGame();
    }
  }

  render() {
    this.context.renderer.update();
  }

  determineResult() {
    if (this.context.player1.health === this.context.player2.health) {
      this.gameResult.winner = null;
    } else if (this.context.player1.health > this.context.player2.health) {
      this.gameResult.winner = this.context.player1;
    } else if (this.context.player2.health > this.context.player1.health) {
      this.gameResult.winner = this.context.player2;
    }
  }

  start() {
    this.steps = [this.render, this.checkAttacks, this.checkPlayersHealth];
    this.context.player1.start();
    this.context.player2.start();
    this.context.timer.run().then(this.endGame.bind(this));
  }

  /**
   * Stops engine with option to continuing rendering
   * but data will not update anymore unless it's started again
   * @param {{continueRendering: boolean}} params
   */
  stop({ continueRendering } = { continueRendering: false }) {
    if (continueRendering) {
      this.steps = [this.render];
    } else {
      this.steps = [];
    }
  }

  endAfterAnimationIsComplete() {
    if (
      this.context.player1.hasPendingAnimation() ||
      this.context.player2.hasPendingAnimation()
    ) {
      return;
    }
    this.emit("end");
  }

  endGame() {
    this.context.timer.stop();
    this.context.player1.stop();
    this.context.player2.stop();
    this.determineResult();
    this.displayWinner();
    this.steps = [this.endAfterAnimationIsComplete, this.render];
  }

  tick() {
    this.steps.forEach((step) => step.bind(this)());
  }

  /**
   *
   * @param {"end"} event
   */
  emit(event) {
    this.eventListeners[event](this.gameResult);
  }

  /**
   * Finds the item by its unique id.
   * @callback eventHandler
   * @param {{winner:Fighter}} winner
   */

  /**
   *
   * @param {"end"} event
   * @param {eventHandler} handler
   */
  on(event, handler) {
    this.eventListeners[event] = handler;
  }
}
