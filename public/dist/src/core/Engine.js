var EngineStates;
(function (EngineStates) {
    EngineStates["New"] = "New";
    EngineStates["Started"] = "Started";
    EngineStates["Stopped"] = "Stopped";
})(EngineStates || (EngineStates = {}));
const ignore = () => void 0;
/**
 * Has all the high-level instructions. Responsible for running the game from start to end.
 *
 * Requires GameContext.
 *
 * Strategy: Frame-by-Frame
 */
export class GameEngine {
    constructor(context) {
        this.context = context;
        this.state = EngineStates.New;
        this.steps = [() => void 0];
        this.eventListeners = {
            end: ignore,
            pause: ignore,
            resume: ignore,
        };
        this.gameResult = {
            winner: null,
        };
    }
    emit(event) {
        this.eventListeners[event](this.gameResult);
    }
    rectangularCollition({ rectangle1, rectangle2, }) {
        if (rectangle1.direction === 'right') {
            return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
                rectangle2.position.x &&
                rectangle1.attackBox.position.x <=
                    rectangle2.position.x + rectangle2.width &&
                rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
                    rectangle2.position.y &&
                rectangle1.attackBox.position.y <=
                    rectangle2.position.y + rectangle2.height);
        }
        return (rectangle1.attackBox.position.x +
            rectangle1.width -
            rectangle1.attackBox.width <=
            rectangle2.position.x + rectangle2.width &&
            rectangle1.position.x >= rectangle2.position.x &&
            rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
                rectangle2.position.y &&
            rectangle1.attackBox.position.y <=
                rectangle2.position.y + rectangle2.height);
    }
    setPlayersDirections() {
        if (this.context.player1.position.x > this.context.player2.position.x) {
            this.context.player1.direction = 'left';
            this.context.player2.direction = 'right';
        }
        else {
            this.context.player1.direction = 'right';
            this.context.player2.direction = 'left';
        }
    }
    checkAttacks() {
        // check if player1 hit player2
        if (this.rectangularCollition({
            rectangle1: this.context.player1,
            rectangle2: this.context.player2,
        }) &&
            this.context.player1.isAttacking &&
            this.context.player1.currentSprite.framesCurrent === 4) {
            this.context.player2.takeHit();
            this.context.player1.isAttacking = false;
            gsap.to(this.context.htmlElements.p2HealthElement, {
                width: `${this.context.player2.health}%`,
            });
        }
        // check if player2 hit player1
        if (this.rectangularCollition({
            rectangle1: this.context.player2,
            rectangle2: this.context.player1,
        }) &&
            this.context.player2.isAttacking &&
            this.context.player2.currentSprite.framesCurrent === 2) {
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
        }
        else {
            this.context.htmlElements.centerTextElement.innerHTML = 'Tie';
        }
        this.context.htmlElements.centerTextElement.style.display = 'flex';
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
        }
        else if (this.context.player1.health > this.context.player2.health) {
            this.gameResult.winner = this.context.player1;
        }
        else if (this.context.player2.health > this.context.player1.health) {
            this.gameResult.winner = this.context.player2;
        }
    }
    endAfterAnimationIsComplete() {
        if (this.context.player1.hasPendingAnimation() ||
            this.context.player2.hasPendingAnimation()) {
            return;
        }
        this.emit('end');
        this.steps.splice(this.steps.indexOf(this.endAfterAnimationIsComplete), 1);
    }
    endGame() {
        this.stop();
        this.determineResult();
        this.displayWinner();
        this.steps.push(this.endAfterAnimationIsComplete);
    }
    start() {
        this.state = EngineStates.Started;
        this.steps = [
            this.render,
            this.setPlayersDirections,
            this.checkAttacks,
            this.checkPlayersHealth,
        ];
        this.context.player1.start();
        this.context.player2.start();
        this.context.timer.run().then(this.endGame.bind(this));
    }
    stop({ continueRendering } = {
        continueRendering: true,
    }) {
        this.state = EngineStates.Stopped;
        this.context.timer.stop();
        this.context.player1.stop();
        this.context.player2.stop();
        if (continueRendering) {
            this.steps = [this.render];
        }
        else {
            this.steps = [];
        }
    }
    tick() {
        this.steps.forEach(step => step.bind(this)());
    }
    on(event, handler) {
        this.eventListeners[event] = handler;
    }
}
GameEngine.states = EngineStates;
