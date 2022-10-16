import { Command } from './general-interfaces';

type InputListenerCallback = (command: Command) => void;

export type InputListenerCallbacks = {
  press: InputListenerCallback;
  release: InputListenerCallback;
};

export interface ListenerMap extends Record<Command, InputListenerCallbacks> {
  undefined: {
    press: InputListenerCallback;
    release: InputListenerCallback;
  };
}

export interface InputListener {
  listeners: ListenerMap;
  start(): void;
  stop(): void;
  on(
    command: Command,
    keyPressedCallback: InputListenerCallback,
    keyReleasedCallback?: InputListenerCallback,
  );
}
