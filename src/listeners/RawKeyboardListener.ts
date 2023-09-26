import {
  KeyboardRawListenerListenFn,
  RawListener,
  SourceType,
} from 'src/types/input-listener.interface';

export class RawKeyboardListener implements RawListener<SourceType.Keyboard> {
  private callbacks: {
    key: string;
    press?: (key: string) => void;
    release?: (key: string) => void;
  }[] = [];

  constructor() {
    this.listener = this.listener.bind(this);
  }

  listen(
    key: string,
    press: (key: string) => void,
    release: (key: string) => void,
  ) {
    this.callbacks.push({ key, press, release });
  }

  private emitPress(key: string) {
    this.callbacks.filter(cb => cb.key === key).forEach(cb => cb.press?.(key));
  }

  private emitRelease(key: string) {
    this.callbacks
      .filter(cb => cb.key === key)
      .forEach(cb => cb.release?.(key));
  }

  private listener(event: KeyboardEvent) {
    if (event.type === 'keydown') {
      this.emitPress(event.key);
    } else if (event.type === 'keyup') {
      this.emitRelease(event.key);
    }
  }

  public start() {
    window.addEventListener('keydown', this.listener);
    window.addEventListener('keyup', this.listener);
  }

  public stop() {
    window.removeEventListener('keydown', this.listener);
    window.removeEventListener('keyup', this.listener);
  }

  read: never;
  setGamepadIndex: never;
}
