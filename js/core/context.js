import { Timer } from "./timer.js";
import { Renderer } from "./renderer.js";
import { Sprite } from "../renderable/sprite.js";
import { Fighter } from "../fighter/v4.js";
import { Paint } from "../renderable/paint.js";
import { Controller } from "../controller/controller.js";

/**
 * Game Context object
 * @typedef {Object} ContextParams
 * @property {CanvasRenderingContext2D} canvas - player 2
 * @property {{canvasElement: HTMLCanvasElement | null,timerElement: HTMLCanvasElement | null,p1HealthElement: HTMLCanvasElement | null,p2HealthElement: HTMLCanvasElement | null,centerTextElement: HTMLCanvasElement | null}} htmlElements - html elements
 * @property {{reset: Paint, background: Sprite, shop: Sprite, contrast: Paint}} sprites - sprites
 * @property {Renderer} renderer - renderer
 * @property {Timer} timer - timer
 * @property {Fighter} player1 - player 1
 * @property {Fighter} player2 - player 2
 * @property {{fighter: Fighter, controller: Controller}[]} players - players
 */

export class Context {
  /**
   *
   * @param {ContextParams} params
   */
  constructor({
    canvas,
    htmlElements,
    sprites,
    renderer,
    timer,
    player1,
    player2,
    players,
  }) {
    this.canvas = canvas;
    this.htmlElements = htmlElements;
    this.sprites = sprites;
    this.renderer = renderer;
    this.timer = timer;
    this.player1 = player1;
    this.player2 = player2;
    this.players = players;
  }
}
