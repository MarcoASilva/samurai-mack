import { Fighter } from './fighter.interface';
import { InputListener } from './input-listener.interface';

export interface ControllerParams {
  commandListener: InputListener;
  fighter: Fighter;
}

export interface Controller extends ControllerParams {
  commandListener: InputListener;
  fighter: Fighter;
}
