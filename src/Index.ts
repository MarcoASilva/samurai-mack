import { GameEvent, Plugin, setup } from './Game';
import config from '../conf/config.json';
import { Sprite } from './renderables/Sprite';

const contextLoggerPlugin: Plugin = context => {
  console.log(context);
  return context;
};

const lightningRunPlugin: Plugin = context => {
  context.players[0].fighter.sprites.run.left = new Sprite({
    canvas: context.canvas,
    position: context.players[0].fighter.position,
    imageSrc: 'http:google.com.br/favicon.png',
    framesMax: 7,
  });
  context.players[0].fighter.sprites.run.right = new Sprite({
    canvas: context.canvas,
    position: context.players[0].fighter.position,
    imageSrc: 'http:google.com.br/favicon.png',
    framesMax: 7,
  });
  return context;
};

const superSpeedPlugin: Plugin = context => {
  context.players[0].fighter.runVelocity = 10;
  (context as any).fuck = true;
  return context;
};

const game = setup(config);

// game.register(contextLoggerPlugin);

game.on('load', ({ context }) => {
  // lightningRunPlugin(context);
  // superSpeedPlugin(context);
  console.log('superSpeedPlugin loaded');
});

const gameEvents: GameEvent[] = [
  /*'load', will overwrite game.on('load', ...) above*/ 'start',
  'pause',
  'resume',
  'end',
];

gameEvents.forEach(event =>
  game.on(event, params => console.log(event, params)),
);

game.on('end', params => game.stop());

game.start();
