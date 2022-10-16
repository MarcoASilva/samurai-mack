import { gsap } from 'gsap';
import { Config } from '@/types/config.type';
import { Fighter } from '@/types/fighter.interface';

export type UIElements =
  | 'timer'
  | 'canvas'
  | 'player1Health'
  | 'player2Health'
  | 'centeredText';

export interface WriteOptions {
  /** Horizontal placement */
  horizontalPosition?: 'left' | 'center' | 'right';
  /** Vertical placement */
  verticalPosition?: 'top' | 'center' | 'bottom';
  /** Text size */
  size?: 'small' | 'medium' | 'big';
  /** CSS-like color (rgb, rgba, hex, named colors) */
  color?: string;
  /** Duration time (in millis) for the text to be displayed */
  duration?: number;
}

export interface HudParams {
  elementIds: {
    [key in UIElements]: string;
  };
  config: Config['screen'];
}

type HudElements = {
  [key in UIElements]: key extends 'canvas'
    ? HTMLCanvasElement
    : HTMLDivElement;
};

const SEL = '#';

export class Hud {
  elements: HudElements;
  canvas: CanvasRenderingContext2D;
  config: Config['screen'];

  constructor({
    elementIds: { canvas, timer, player1Health, player2Health, centeredText },
    config,
  }: HudParams) {
    this.config = config;
    this.elements.canvas = document.querySelector(SEL + canvas);
    this.elements.timer = document.querySelector(SEL + timer);
    this.elements.player1Health = document.querySelector(SEL + player1Health);
    this.elements.player2Health = document.querySelector(SEL + player2Health);
    this.elements.centeredText = document.querySelector(SEL + centeredText);

    this.validate();

    this.canvas = this.elements.canvas.getContext('2d');
  }

  validate() {
    if (!this.elements.canvas) {
      throw new Error(`Canvas element not found`);
    }
    if (this.elements.canvas.nodeName !== 'CANVAS') {
      throw new Error(
        `Canvas element must be of type <canvas>. Instead got ${this.elements.canvas.nodeName}`,
      );
    }
    try {
      if (
        !this.elements.canvas.getContext('2d').drawImage ||
        !this.elements.canvas.getContext('2d').fill
      ) {
        throw new Error('Canvas not supported');
      }
    } catch (error) {
      throw new Error('Canvas not supported');
      console.log(error);
    }
  }

  start() {
    this.elements.canvas.width = this.config.resolution.width;
    this.elements.canvas.height = this.config.resolution.height;
    this.elements.player1Health.style.width = '100%';
    this.elements.player2Health.style.width = '100%';
    this.elements.centeredText.style.display = 'none';
  }

  write(text: string, options: WriteOptions = { duration: 3000 }) {
    // create logic to apply different options/styles to text
    // maybe create a separate class to delegate this (e.g HTMLTextWriter)
    this.elements.centeredText.innerHTML = text;
    this.elements.centeredText.style.display = 'flex';
    setTimeout(
      () => (this.elements.centeredText.style.display = 'none'),
      options.duration,
    );
  }

  /**
   *
   * Displays the winner of the match using "winner" preset style on the HUD
   */
  displayeWinner(winner: Fighter | null): void {
    if (winner) {
      this.write(`${winner.playerName} Wins`, {
        duration: Number.POSITIVE_INFINITY,
      });
    } else {
      this.write('Tie', {
        duration: Number.POSITIVE_INFINITY,
      });
    }
  }

  updatePlayer1HealthBar(healthPointsPercentage: number): void {
    gsap.to(this.elements.player1Health, {
      width: `${healthPointsPercentage}%`,
    });
  }

  updatePlayer2HealthBar(healthPointsPercentage: number): void {
    gsap.to(this.elements.player1Health, {
      width: `${healthPointsPercentage}%`,
    });
  }
}
