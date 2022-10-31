import { Character } from '../types/character.interface';
import Toastify from 'toastify-js';

export class Utils {
  static rectangularCollition({
    rectangle1,
    rectangle2,
  }: {
    rectangle1: Character;
    rectangle2: Character;
  }) {
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

  static determineWinner({
    player1,
    player2,
  }: {
    player1: Character;
    player2: Character;
  }) {
    document.querySelector<HTMLDivElement>('#displayText').style.display =
      'flex';
    if (player1.health === player2.health) {
      document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player1.health > player2.health) {
      document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if (player2.health > player1.health) {
      document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
  }

  static getHtmlElements() {
    // document.querySelector<HTMLDivElement>('#player1Health').style.width =
    //   '100%';
    // document.querySelector<HTMLDivElement>('#player2Health').style.width =
    //   '100%';
    // document.querySelector<HTMLDivElement>('#displayText').style.display =
    //   'none';
    return {
      canvasElement: document.querySelector('canvas'),
      timerElement: document.querySelector<HTMLDivElement>('#timer'),
      p1HealthElement: document.querySelector<HTMLDivElement>('#player1Health'),
      p2HealthElement: document.querySelector<HTMLDivElement>('#player2Health'),
      centerTextElement: document.querySelector<HTMLDivElement>('#displayText'),
    };
  }

  static showControllerConnectedNotification() {
    Toastify({
      text: 'Controller Connected',
      avatar: '/img/xbox-gamepad-icon-white-xsmall.png',
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
      className: 'toast',
    }).showToast();
  }

  static showControllerDisconnectedNotification() {
    Toastify({
      text: 'Controller Disconnected',
      avatar: '/img/xbox-gamepad-icon-white-xsmall.png',
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background:
          'linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))',
      },
      className: 'toast',
    }).showToast();
  }

  static showToast(message) {
    Toastify({
      text: message,
      avatar: '/img/info-icon.png',
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
      className: 'teste',
      onClick: function () {},
    }).showToast();
  }
}
