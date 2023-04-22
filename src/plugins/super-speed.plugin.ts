import { Plugin } from '../Game';

export const superSpeedPlugin: Plugin = context => {
  context.players[0].character.attributes.runVelocity = 10;
  context.players[1].character.attributes.runVelocity = 10;
  (context as any).fuck = true;
  return context;
};
