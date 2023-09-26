import {
  RawListener as RawListenerInterface,
  SourceType,
} from '../types/input-listener.interface';

type RawListenerEvent = 'press' | 'release';
type Callback = (button: number) => void;
type RawEventListeners = Map<number, Array<Record<RawListenerEvent, Callback>>>;

/**
 * Polls a given gamepad's buttons (specified by gamepadIndex)
 * and enables event-driven design by allowing listeners to be attached.
 *
 * Events: `press` || `release`
 *
 * The poll rate can controlled by the read method, which can be bound to any loop function.
 */
export class RawGamepadListener
  implements RawListenerInterface<SourceType.Gamepad>
{
  private buttons: GamepadButton[];
  private listeners: RawEventListeners = new Map();
  gamepadIndex: number;

  constructor({ gamepadIndex }: { gamepadIndex: number }) {
    this.gamepadIndex = gamepadIndex;
    this.loadButtons();
    console.log(this.listeners);
  }

  get gamepad() {
    return navigator.getGamepads()[this.gamepadIndex];
  }

  private loadButtons(): void {
    this.buttons =
      this.gamepad?.buttons?.map((b, i) => {
        if (!this.listeners.get(i)) this.listeners.set(i, []);
        return b;
      }) ?? [];
  }

  private setButtons(buttons: GamepadButton[]) {
    this.buttons = buttons;
  }

  private emit({ event, button }: { event: RawListenerEvent; button: number }) {
    console.log({ event, button }, this.listeners.get(button));
    this.listeners.get(button)?.forEach(l => l[event](button));
  }

  /**
   * Listen for events on the gamepad buttons (press || release).
   * @param button button to listen for
   * @param press callback for when the button is pressed
   * @param release callback for when the button is released
   */
  listen(
    button: number,
    press: Callback = () => void 0,
    release: Callback = () => void 0,
  ) {
    console.log('listen');
    this.listeners.get(button)?.push({ press, release }) ||
      this.listeners.set(button, [{ press, release }]);
    console.log(this.listeners);
  }

  /**
   * **MUST CALL**: Call this method everytime you want to poll values from gamepad.
   * The poll rate is up to the caller (e.g 100 times per second). It's advised to call within `window.requestAnimationFrame()`
   */
  read(): void {
    this.buttons.forEach((b, i) => {
      if (!b.pressed && this.gamepad.buttons[i].pressed) {
        return this.emit({ event: 'press', button: i });
      }
      if (b.pressed && !this.gamepad.buttons[i].pressed) {
        return this.emit({ event: 'release', button: i });
      }
    });
    this.setButtons(this.gamepad?.buttons?.concat() ?? []);
  }

  /**
   * Call this method whenever a new gamepad has been attached or the current gamepad changed.
   * Otherwise it will poll the wrong gamepad or won't read anything.
   * @param gamepadIndex index of the desired gamedpad to read from in `navigator.getGamepads()`
   */
  setGamepadIndex(gamepadIndex: number): void {
    console.log('setGamepadIndex');
    this.gamepadIndex = gamepadIndex;
    this.loadButtons();
  }
}
