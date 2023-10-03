import { Command } from '../types/general-interfaces';
import {
  InputSource,
  CommandListener as CommandListenerInterface,
  SourceType,
} from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';

/**
 * `CommandListener` extends **BaseListener** which only supports **one callback registered** at a time. If you change it to allow multiple callbacks to be registered, make sure to don't pass the `CommandListener` to both `Controller` and `Character` or it will have duplicate commands being processed by `Character` because `Character`'s methods `startRunningLeft`, `stopRunningLeft`, `startRunningRight`, `stopRunningRight`, `jump` and `attack` would be called **twice**.
 */
export class CommandListener
  extends BaseListener
  implements CommandListenerInterface
{
  sources: InputSource<SourceType>[];

  constructor({ sources }: { sources: InputSource<SourceType>[] }) {
    super();

    this.sources = sources;

    this.sources.forEach(source => {
      Object.keys(this.listeners).forEach((key: Command) => {
        source.on(
          key,
          () => this.propagate({ command: key, event: 'press' }),
          () => this.propagate({ command: key, event: 'release' }),
        );
      });
    });
  }

  start() {
    this.sources.forEach(input => input.start());
  }

  stop() {
    this.sources.forEach(input => input.stop());
  }

  private propagate({
    command,
    event,
  }: {
    command: Command;
    event: 'press' | 'release';
  }) {
    this.listeners[command][event](command);
  }
}
