import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../globals/rules.js";
import { Sprite } from "./sprite.js";

export class Paint extends Sprite {
  constructor({
    canvas = new CanvasRenderingContext2D(),
    x = 0,
    y = 0,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
    color = "black",
  }) {
    super({ canvas });

    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    this.canvas.fillStyle = this.color;
    this.canvas.fillRect(this.x, this.y, this.width, this.height);
  }

  animateFrames() {}

  update() {
    this.draw();
  }
}
