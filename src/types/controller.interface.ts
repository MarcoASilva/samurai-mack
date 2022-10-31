import { Character } from './character.interface';
import { InputListener } from './input-listener.interface';

export interface ControllerParams {
  commandListener: InputListener;
  character: Character;
}

export interface Controller extends ControllerParams {
  commandListener: InputListener;
  character: Character;
}
