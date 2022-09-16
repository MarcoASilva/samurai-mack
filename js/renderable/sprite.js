export class Sprite {
  constructor({
    canvas = new CanvasRenderingContext2D(),
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.canvas = canvas;
    this.position = position;
    this.image = new Image();
    if (imageSrc) {
      this.image.src = imageSrc;
    }
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.offset = offset;
  }

  draw() {
    this.canvas.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  /**
   * This is the method that gets called every frame to re-render Sprite
   * This method also contains the logics for the updateing positions, animations, inner workings and the drawing itself
   */
  update() {
    this.draw();
    this.animateFrames();
  }
}
