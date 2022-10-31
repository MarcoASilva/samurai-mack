import { Sprite } from '../types/sprite.interface';

export interface RendererParams {
  sprites: Sprite[];
}

export class Renderer {
  sprites: Sprite[];

  /**
   * **IMPORTANT:** order matters here as the sprites will be rendered one upon another.
   * So the index means the "z-index" of each sprite in the array
   */
  constructor({ sprites }) {
    this.sprites = sprites;
  }

  update() {
    this.sprites.forEach(sprite => sprite.render());
  }
}
