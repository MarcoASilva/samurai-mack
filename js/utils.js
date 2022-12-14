export function rectangularCollition({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

export function determineWinner({ player1, player2 }) {
  document.querySelector("#displayText").style.display = "flex";
  if (player1.health === player2.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player1.health > player2.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (player2.health > player1.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
}

export function getHtmlElements() {
  document.querySelector("#player1Health").style.width = "100%";
  document.querySelector("#player2Health").style.width = "100%";
  document.querySelector("#displayText").style.display = "none";
  return {
    canvasElement: document.querySelector("canvas"),
    timerElement: document.querySelector("#timer"),
    p1HealthElement: document.querySelector("#player1Health"),
    p2HealthElement: document.querySelector("#player2Health"),
    centerTextElement: document.querySelector("#displayText"),
  };
}

export function showControllerConnectedNotification() {
  Toastify({
    text: "Controller Connected",
    avatar: "/img/xbox-gamepad-icon-white-xsmall.png",
    duration: 8000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    className: "toast",
  }).showToast();
}

export function showControllerDisconnectedNotification() {
  Toastify({
    text: "Controller Disconnected",
    avatar: "/img/xbox-gamepad-icon-white-xsmall.png",
    duration: 8000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background:
        "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
    },
    className: "toast",
  }).showToast();
}

export function showToast(message) {
  Toastify({
    text: message,
    avatar: "/img/info-icon.png",
    duration: 8000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    className: "teste",
    onClick: function () {},
  }).showToast();
}
