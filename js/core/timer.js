import { ROUND_TIME } from "../globals/rules.js";

export class Timer {
  constructor({ roundTime = ROUND_TIME, timerElement }) {
    if (!timerElement) throw "No timerElement passed in Timer constructor";

    this.roundTime = roundTime;
    this.timerElement = timerElement;
    this.intervalId;
  }

  run() {
    return new Promise((resolve) => {
      this.intervalId = setInterval(() => {
        this.roundTime--;
        this.timerElement.innerHTML = this.roundTime;
        if (this.roundTime === 0) {
          clearInterval(this.intervalId);
          resolve();
        }
      }, 1000);
    });
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

let timerId;

export function decreaseTime() {
  timerId = setTimeout(decreaseTime, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
