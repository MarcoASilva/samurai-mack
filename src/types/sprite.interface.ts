import { XYCoordinates } from './general-interfaces';
import { Renderable } from './renderable.interface';

export interface Sprite extends Renderable {
  canvas: CanvasRenderingContext2D;
  /** Current Sprite's position. Position may change frame after frame */
  position: XYCoordinates;
  /** Image file URL */
  imageSrc: string;
  /**
   * @deprecated
   * Inverted Image file URL
   * */
  invertedImageSrc?: string;
  /** Current loaded image for drawing frames. */
  image: HTMLImageElement;
  /** Used to scale up and down and sprite size (width and height). Usually defaults to 1 (which means no scalling since height|width * 1 = width|height). */
  scale: number;
  /** Total number of frames extracted from imageSrc. This represents the whole animation frames count. */
  framesMax: number;
  /** Exactly curent frame (out of all the frames contained in imageSrc for this Sprite (`framesMax`)) rendered on the screen. */
  framesCurrent: number;
  /** Total frames rendered since the beginning Sprite was instantiated. This number can only increase and never goes back to zero. */
  framesElapsed: number;
  /** Amount of renders until change to next frame of the animation. This means animation speed per se. */
  framesHold: number;
  offset: XYCoordinates;
  draw(): void;
  animateFrames(): void;
  invert(): void;
  update(): void;
}
