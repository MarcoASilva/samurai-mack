import { Sprite } from './sprite.interface';

export interface Renderer {
  sprites: Sprite[];
  update(): void;
}
