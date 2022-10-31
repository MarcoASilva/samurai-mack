import { Config } from './config.type';
import { Character } from './character.interface';

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

export interface WriteParams {
  text: string;
  options?: WriteOptions;
}

export interface HudParams {
  config: Config;
}

export interface Hud {
  displayeWinner(winner: Character | null): void;
  updateHealthBar({
    bar,
    percentage,
  }: {
    bar: 0 | 1;
    percentage: number;
  }): void;
  write(params: WriteParams): void;
}
