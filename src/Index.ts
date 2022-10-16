import { GameEvent, Plugin, setup } from './Game';
import config from '../config';
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
  const playersProgres = {
    537321: { rank: 'Graduated', level: 4 },
    94127: { rank: 'Rookie', level: 1 },
    9120: { rank: 'Samurai', level: 7 },
  };
  context.players.forEach(player => {
    player.fighter.runVelocity = playersProgres[player.user.id].level * 2;
  });
  return context;
};

const game = setup(config);

game.register(contextLoggerPlugin);

game.on('load', ({ context }) => {
  lightningRunPlugin(context);
  superSpeedPlugin(context);
});

const gameEvents: GameEvent[] = ['start', 'pause', 'resume', 'end'];

gameEvents.forEach(event =>
  game.on(event, params => console.log(event, params)),
);

game.start();
