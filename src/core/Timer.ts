import { Timer as TimerInterface } from '../types/timer.interface';

export interface TimerParams {
  roundTime: number;
  timerElement: HTMLDivElement;
}

export class Timer implements TimerInterface {
  roundTime: number;
  currentTime: number;
  timerElement: HTMLDivElement;
  private intervalId: number;

  constructor({ roundTime, timerElement }) {
    if (!timerElement) throw 'No timerElement passed in Timer constructor';

    this.roundTime = roundTime;
    this.currentTime = roundTime;
    this.timerElement = timerElement;
  }

  async run(): Promise<void> {
    return new Promise<void>(resolve => {
      this.intervalId = setInterval(() => {
        this.currentTime--;
        this.timerElement.innerHTML = String(this.currentTime);
        if (this.currentTime === 0) {
          clearInterval(this.intervalId);
          resolve();
        }
      }, 1000);
    });
  }

  stop(): void {
    clearInterval(this.intervalId);
  }
}
