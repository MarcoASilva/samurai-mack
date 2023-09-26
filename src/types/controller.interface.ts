import { Character } from './character.interface';
import { CommandListener, SourceType } from './input-listener.interface';

export interface ControllerParams {
  commandListener: CommandListener;
  character: Character;
}

export interface Controller extends ControllerParams {
  commandListener: CommandListener;
  character: Character;
}
