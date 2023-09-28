import { Plugin } from './Game';
import { Sprite } from './renderables/Sprite';

export const contextLoggerPlugin: Plugin = context => {
  console.log(context);
  return context;
};

export const lightningRunPlugin: Plugin = context => {
  context.players[0].character.sprites.run.left = new Sprite({
    canvas: context.canvas,
    position: context.players[0].character.position,
    imageSrc: 'http:google.com.br/favicon.png',
    framesMax: 7,
  });
  context.players[0].character.sprites.run.right = new Sprite({
    canvas: context.canvas,
    position: context.players[0].character.position,
    imageSrc: 'http:google.com.br/favicon.png',
    framesMax: 7,
  });
  return context;
};

export const lowGravity: Plugin = context => {
  context.players[0].character.game.gravity = 0.5;
};
