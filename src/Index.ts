import { slowMotionPlugin, superSpeedPlugin, teleportPower } from './plugins';
import { setup } from './Game';
import config from '../conf/config.json';

const game = setup(config);

game.on('load', ({ context }) => {
  slowMotionPlugin(context);
  superSpeedPlugin(context);
  teleportPower(context);
});

game.on('end', _  => game.stop());

game.start();
