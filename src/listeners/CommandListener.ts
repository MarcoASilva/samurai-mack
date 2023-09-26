import { Command } from '../types/general-interfaces';
import {
  InputSource,
  CommandListener as CommandListenerInterface,
  SourceType,
} from '../types/input-listener.interface';
import { BaseListener } from './BaseListener';

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
