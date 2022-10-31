import { Paint } from '../renderables/Paint';
import { Sprite } from '../renderables/Sprite';
import { Config } from '../types/config.type';
import { LogicalComponent } from '../types/logical-component.interface';

export class Scenario implements LogicalComponent {
  reset: Paint;
  contrast: Paint;
  background: Sprite;
  shop: Sprite;

  constructor(config: Config, canvas: CanvasRenderingContext2D) {
    this.reset = new Paint({
      canvas: canvas,
      color: 'black',
      x: 0,
      y: 0,
      width: config.canvas.width,
      height: config.canvas.height,
    });

    this.contrast = new Paint({
      canvas: canvas,
      color: config.scenario.contrast,
      x: 0,
      y: 0,
      width: config.canvas.width,
      height: config.canvas.height,
    });

    this.background = new Sprite({
      canvas: canvas,
      position: { x: 0, y: 0 },
      imageSrc: config.scenario.background,
      scale: 1,
    });

    this.shop = new Sprite({
      canvas: canvas,
      position: { x: 600, y: 128 },
      imageSrc: config.scenario.shop,
      scale: 2.75,
      framesMax: 6,
    });
  }

  update(): void {
    this.reset.render();
    this.background.render();
    this.shop.render();
    this.contrast.render();
  }
}
