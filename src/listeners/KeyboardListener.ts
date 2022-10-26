import { Command } from '../types/general-interfaces';
import { InputListenerCallbacks } from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';

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

export class KeyboardListener extends BaseListener {
  commands: KeyboardCommands;
  eventMap: EventMap;
  listener: (this: any, event: KeyboardEvent) => void;

  constructor({
    left = '',
    right = '',
    jump = '',
    attack = '',
  }: KeyboardListenerParams) {
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

    this.listener = this._processInput.bind(this);
  }

  _processInput(event: KeyboardEvent) {
    this.listeners[this.commands[event.key] as Command]?.[
      this.eventMap[event.type]
    ](this.commands[event.key] as Command);
  }

  start() {
    window.addEventListener('keydown', this.listener);
    window.addEventListener('keyup', this.listener);
  }

  stop() {
    window.removeEventListener('keydown', this.listener);
    window.removeEventListener('keyup', this.listener);
  }
}
