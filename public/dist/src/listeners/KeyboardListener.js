import { BaseListener } from './BaseListener';
export class KeyboardListener extends BaseListener {
    constructor({ left = '', right = '', jump = '', attack = '', }) {
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
    _processInput(event) {
        var _a;
        (_a = this.listeners[this.commands[event.key]]) === null || _a === void 0 ? void 0 : _a[this.eventMap[event.type]](this.commands[event.key]);
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
