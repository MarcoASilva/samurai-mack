import { Command } from '../types/general-interfaces';
import {
  InputListenerCallbacks,
  InputSource,
  RawListener,
  SourceType,
} from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';
import { RawKeyboardListener } from './RawKeyboardListener';

type KeyboardCommands = {
  [key: string]: Command;
};

type KeyboardEvents = 'keydown' | 'keyup';

type EventMap = {
  [key in KeyboardEvents]: keyof InputListenerCallbacks;
};

/**
 * Command <-> key binding params
 *
 * Keys will be defaulted to empty string when value is not provided
 */
export type KeyboardListenerParams = {
  [key in Command]?: string;
};

export class KeyboardListener
  extends BaseListener
  implements InputSource<SourceType.Keyboard>
{
  private commands: KeyboardCommands;
  private eventMap: EventMap;

  type: SourceType.Keyboard = SourceType.Keyboard;
  raw: RawListener<SourceType.Keyboard>;

  constructor({
    left = '',
    right = '',
    jump = '',
    attack = '',
  }: KeyboardListenerParams) {
    // this.raw.listen();

    super();

    this.commands = {
      [left]: 'left',
      [right]: 'right',
      [jump]: 'jump',
      [attack]: 'attack',
    };

    this.eventMap = {
      keydown: 'press',
      keyup: 'release',
    };

    this.listener = this.processInput.bind(this);

    this.raw = new RawKeyboardListener();
  }

  // used to bind `this` and to store pointer referece needed for removeEventListener
  private listener: (event: KeyboardEvent) => void;

  private processInput(event: KeyboardEvent) {
    this.listeners[this.commands[event.key] as Command]?.[
      this.eventMap[event.type]
    ](this.commands[event.key] as Command);
  }

  start() {
    window.addEventListener('keydown', this.listener);
    window.addEventListener('keyup', this.listener);
    (this.raw as RawKeyboardListener).start();
  }

  stop() {
    window.removeEventListener('keydown', this.listener);
    window.removeEventListener('keyup', this.listener);
    (this.raw as RawKeyboardListener).stop();
  }
}
