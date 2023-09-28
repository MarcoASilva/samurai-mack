import { Command } from './general-interfaces';

export type InputListenerCallback = (command: Command) => void;

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

export enum SourceType {
  Gamepad = 'Gamepad',
  Keyboard = 'Keyboard',
}

export type RawListenerCallback<T extends SourceType> =
  T extends SourceType.Gamepad
    ? (button: number) => void
    : T extends SourceType.Keyboard
    ? (button: string) => void
    : never;

export type GamepadRawListenerListenFn = (
  button: number,
  press: (button: number) => void,
  release: (button: number) => void,
) => void;

export type KeyboardRawListenerListenFn = (
  key: string,
  press: (key: string) => void,
  release: (key: string) => void,
) => void;

export type RawListenerType<T extends SourceType> = T extends SourceType.Gamepad
  ? GamepadRawListenerListenFn
  : KeyboardRawListenerListenFn;

export interface RawListener<T extends SourceType> {
  listen: T extends SourceType.Gamepad
    ? GamepadRawListenerListenFn
    : KeyboardRawListenerListenFn;

  read: T extends SourceType.Gamepad ? () => void : never;
  setGamepadIndex: T extends SourceType.Gamepad
    ? (gamepadIndex: number) => void
    : never;
}

export interface InputSource<T extends SourceType> extends InputListener {
  type: T;
  raw: RawListener<T>;
}
export interface CommandListener extends InputListener {
  sources: InputSource<SourceType>[];
}
