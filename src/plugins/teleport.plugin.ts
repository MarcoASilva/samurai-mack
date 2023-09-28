import { BaseListener } from '../listeners/BaseListener';
import {
  InputSource,
  RawListener,
  SourceType,
} from '../types/input-listener.interface';
import { Plugin } from '../Game';

export const teleportPower: Plugin = context => {
  const rawGamePadListener =
    context.players[0].controller.commandListener.sources.find(
      (s): s is InputSource<SourceType.Gamepad> =>
        s.type === SourceType.Gamepad,
    ).raw;

  rawGamePadListener.listen(
    4,
    () => {
      context.players[0].character.position.x =
        context.players[0].character.position.x - 400;
    },
    undefined,
  );

  rawGamePadListener.listen(
    5,
    () => {
      context.players[0].character.position.x =
        context.players[0].character.position.x + 400;
    },
    undefined,
  );

  console.log(context.players[0].controller.commandListener.sources);

  const rawKeyboardListener =
    context.players[0].controller.commandListener.sources.find(
      (s): s is InputSource<SourceType.Keyboard> =>
        s.type === SourceType.Keyboard,
    ).raw;

  rawKeyboardListener.listen(
    'h',
    () => {
      context.players[0].character.position.x =
        context.players[0].character.position.x + 400;
    },
    undefined,
  );
};
