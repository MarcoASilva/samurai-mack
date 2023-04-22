import { RawListener, SourceType } from 'src/types/input-listener.interface';
import { Plugin } from '../Game';

export const teleportPower: Plugin = context => {
  const raw = context.players[0].controller.commandListener.sources.find(
    s => s.type === 'Gamepad',
  ).raw as RawListener<SourceType.Gamepad>;

  raw.listen(
    4,
    () => {
      context.players[0].character.position.x =
        context.players[0].character.position.x - 400;
    },
    undefined,
  );

  raw.listen(
    5,
    () => {
      context.players[0].character.position.x =
        context.players[0].character.position.x + 400;
    },
    undefined,
  );
};
