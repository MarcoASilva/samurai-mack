import { gsap } from 'gsap';
import { Character } from '../types/character.interface';
import { Timer } from './Timer';
import {
  Hud as HudInterface,
  HudParams,
  WriteParams,
} from '../types/hud.interface';

const ONE_HOUR_IN_MS = 3_600_000;

export class Hud implements HudInterface {
  timer: Timer;
  healthBars: [HTMLDivElement, HTMLDivElement];
  centerText: HTMLDivElement;

  private centerTextTimeoutId: number;

  constructor({ config }: HudParams) {
    this.centerText = document.querySelector(config.hud.centerText);

    this.timer = new Timer({
      timerElement: document.querySelector(config.hud.timer),
      roundTime: config.game.roundTime,
    });

    this.healthBars = [
      document.querySelector(config.hud.player1HealthBar),
      document.querySelector(config.hud.player2HealthBar),
    ];

    this.healthBars.forEach(bar => (bar.style.width = '100%'));
    this.centerText.style.display = 'none';
    this.validate();
  }

  private validate() {
    // if (!this.elements.canvas) {
    //   throw new Error(`Canvas element not found`);
    // }
    // if (this.elements.canvas.nodeName !== 'CANVAS') {
    //   throw new Error(
    //     `Canvas element must be of type <canvas>. Instead got ${this.elements.canvas.nodeName}`,
    //   );
    // }
    // try {
    //   if (
    //     !this.elements.canvas.getContext('2d').drawImage ||
    //     !this.elements.canvas.getContext('2d').fill
    //   ) {
    //     throw new Error('Canvas not supported');
    //   }
    // } catch (error) {
    //   throw new Error('Canvas not supported');
    //   console.log(error);
    // }

    const missingHudElements = [
      { name: 'timer', element: this.timer.timerElement },
      { name: 'centerText', element: this.centerText },
      ...this.healthBars.map((element, i) => ({
        name: `healthbar-${i}`,
        element,
      })),
    ].filter(item => item.element?.nodeName !== 'DIV');

    if (missingHudElements.length) {
      console.debug(missingHudElements);
      throw new Error(
        `Missing elements in HUD: ${missingHudElements
          .map(e => e.name)
          .join(', ')}`,
      );
    }
  }

  /**
   *
   * Displays the winner of the match using "winner" preset style on the HUD
   */
  displayeWinner(winner: Character | null): void {
    if (winner) {
      this.write({
        text: `${winner.playerName} Wins`,
        options: {
          duration: ONE_HOUR_IN_MS,
        },
      });
    } else {
      this.write({
        text: 'Tie',
        options: {
          duration: ONE_HOUR_IN_MS,
        },
      });
    }
  }

  /**
   *
   * Updates a given health bar in the healthbar list
   */
  updateHealthBar({
    bar,
    percentage,
  }: {
    bar: 0 | 1;
    percentage: number;
  }): void {
    gsap.to(this.healthBars[bar], {
      width: `${percentage}%`,
    });
  }

  write({ text, options: { duration } = { duration: 3000 } }: WriteParams) {
    this.centerText.innerHTML = text;
    this.centerText.style.display = 'flex';

    clearTimeout(this.centerTextTimeoutId);

    this.centerTextTimeoutId = setTimeout(
      () => (this.centerText.style.display = 'none'),
      duration,
    );
  }
}
