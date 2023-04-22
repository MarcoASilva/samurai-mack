import {
  RawListener,
  RawListenerCallback,
  SourceType,
} from '../types/input-listener.interface';
import { Plugin } from '../Game';

export const slowMotionPlugin: Plugin = context => {
  /* not going to run in every frame, so can create vars inside as it won't leak memory */

  const originalGravity = context.players[0].character.game.gravity;
  const slowGravity = originalGravity / 4;

  const originalJumpVelocity =
    context.players[0].character.attributes.jumpVelocity;
  const slowJumpVelocity = originalJumpVelocity / 2;

  const gamepadInputListener: {
    button: number;
    press: RawListenerCallback<SourceType.Gamepad>;
    release: RawListenerCallback<SourceType.Gamepad>;
  } = {
    button: 7,
    press: () => {
      console.log('slowGravityPower: PRESSED BUTTON 6');
      context.players[0].character.game.gravity = slowGravity;
      context.players[0].character.attributes.jumpVelocity = slowJumpVelocity;
      if (context.players[0].character.velocity.y < slowJumpVelocity) {
        context.players[0].character.velocity.y = slowJumpVelocity;
      }
      if (context.players[0].character.velocity.y > 0) {
        context.players[0].character.velocity.y = slowGravity;
      }
    },
    release: () => {
      console.log('slowGravityPower: RELEASED BUTTON 6');
      context.players[0].character.game.gravity = originalGravity;
      context.players[0].character.attributes.jumpVelocity =
        originalJumpVelocity;
    },
  };

  context.players.forEach(player =>
    player.controller.commandListener.sources.forEach(source => {
      if (source.type === SourceType.Gamepad) {
        (source.raw as RawListener<SourceType.Gamepad>).listen(
          gamepadInputListener.button,
          gamepadInputListener.press,
          gamepadInputListener.release,
        );
      }
    }),
  );
};
