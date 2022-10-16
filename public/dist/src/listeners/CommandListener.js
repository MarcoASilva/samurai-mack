import { BaseListener } from './BaseListener';
export class CommandListener extends BaseListener {
    constructor({ sources }) {
        super();
        this.sources = sources;
        this.sources.forEach(source => {
            Object.keys(this.listeners).forEach((key) => {
                source.on(key, () => this.propagate({ command: key, event: 'press' }), () => this.propagate({ command: key, event: 'release' }));
            });
        });
    }
    start() {
        this.sources.forEach(input => input.start());
    }
    stop() {
        this.sources.forEach(input => input.stop());
    }
    propagate({ command, event, }) {
        this.listeners[command][event](command);
    }
}
