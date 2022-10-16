export class BaseListener {
    constructor() {
        this.ignore = (command) => void 0;
        this.listeners = {
            left: {
                press: this.ignore,
                release: this.ignore,
            },
            right: {
                press: this.ignore,
                release: this.ignore,
            },
            jump: {
                press: this.ignore,
                release: this.ignore,
            },
            attack: {
                press: this.ignore,
                release: this.ignore,
            },
            undefined: {
                press: this.ignore,
                release: this.ignore,
            },
        };
    }
    start() {
        throw new Error('start is not implemented!');
    }
    stop() {
        throw new Error('start is not implemented!');
    }
    on(command, keyPressedCallback = this.ignore, keyReleasedCallback = this.ignore) {
        if (!Object.keys(this.listeners).includes(command)) {
            console.warn(`Registered listener for UNEXISTING COMMAND: ${command}. Available commands to listen to are: ${Object.keys(this.listeners)}`);
        }
        this.listeners[command] = {
            press: keyPressedCallback,
            release: keyReleasedCallback,
        };
    }
}
