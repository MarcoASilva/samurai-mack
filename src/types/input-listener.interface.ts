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
  press: RawListenerCallback<SourceType.Gamepad>,
  release: RawListenerCallback<SourceType.Gamepad>,
) => void;

export type KeyboardRawListenerListenFn = (
  button: string,
  press: RawListenerCallback<SourceType.Keyboard>,
  release: RawListenerCallback<SourceType.Keyboard>,
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

export interface InputSource extends InputListener {
  type: SourceType;
  raw: RawListener<SourceType>;
}
export interface CommandListener extends InputListener {
  sources: InputSource[];
}
