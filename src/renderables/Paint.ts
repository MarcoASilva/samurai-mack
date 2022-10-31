import { Renderable } from '../types/renderable.interface';

export interface PaintParams {
  canvas: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export class Paint implements Renderable {
  canvas: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor({
    canvas = new CanvasRenderingContext2D(),
    x,
    y,
    width,
    height,
    color = 'black',
  }: PaintParams) {
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

  render() {
    this.draw();
  }
}
