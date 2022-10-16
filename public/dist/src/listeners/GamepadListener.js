import { BaseListener } from './BaseListener.js';
export class GamepadListener extends BaseListener {
    constructor({ config: { left = -1, right = -2, jump = -3, attack = -4 }, gamepadIndex, }) {
        super();
        this.gamepadIndex = gamepadIndex;
        this.commands = {
            left,
            right,
            jump,
            attack,
        };
        this.state = {
            previous: {
                left: false,
                right: false,
                jump: false,
                attack: false,
            },
            current: {
                left: false,
                right: false,
                jump: false,
                attack: false,
            },
        };
        this.axisXValue = 0;
        this.readButtonsRequestId;
    }
    start() {
        this._readButtons();
    }
    stop() {
        this._stopReadingButtons();
    }
    get gamepad() {
        return navigator.getGamepads()[this.gamepadIndex];
    }
    setGamepad({ gamepadIndex, config }) {
        this.gamepadIndex = gamepadIndex;
        if (config) {
            Object.keys(this.commands).forEach(key => (this.commands[key] = config[key]));
        }
        console.info('New Gamepad set:', gamepadIndex, this.gamepad.id, this.gamepad);
    }
    _readButtons() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        Object.assign(this.state.previous, this.state.current);
        this.axisXValue = Math.round((((_b = (_a = this.gamepad) === null || _a === void 0 ? void 0 : _a.axes) === null || _b === void 0 ? void 0 : _b[0]) || 0) * 100);
        this.state.current.left = Boolean(((_f = (_d = (_c = this.gamepad) === null || _c === void 0 ? void 0 : _c.buttons) === null || _d === void 0 ? void 0 : _d[(_e = this.commands) === null || _e === void 0 ? void 0 : _e.left]) === null || _f === void 0 ? void 0 : _f.pressed) ||
            this.axisXValue < 50);
        this.state.current.right = Boolean(((_k = (_h = (_g = this.gamepad) === null || _g === void 0 ? void 0 : _g.buttons) === null || _h === void 0 ? void 0 : _h[(_j = this.commands) === null || _j === void 0 ? void 0 : _j.right]) === null || _k === void 0 ? void 0 : _k.pressed) ||
            this.axisXValue < -50);
        this.state.current.jump = Boolean((_p = (_m = (_l = this.gamepad) === null || _l === void 0 ? void 0 : _l.buttons) === null || _m === void 0 ? void 0 : _m[(_o = this.commands) === null || _o === void 0 ? void 0 : _o.jump]) === null || _p === void 0 ? void 0 : _p.pressed);
        this.state.current.attack = Boolean((_t = (_r = (_q = this.gamepad) === null || _q === void 0 ? void 0 : _q.buttons) === null || _r === void 0 ? void 0 : _r[(_s = this.commands) === null || _s === void 0 ? void 0 : _s.attack]) === null || _t === void 0 ? void 0 : _t.pressed);
        Object.entries(this.state.previous).forEach(([key, value]) => {
            if (!value && this.state.current[key]) {
                this.listeners[key].press(key);
            }
            if (value && !this.state.current[key]) {
                this.listeners[key].release(key);
            }
            // if (this.axisXState.current > 50) {
            //   this.listeners.right.press();
            // }
            // if (this.axisXState.current < -50) {
            //   this.listeners.left.press();
            // }
            // if (this.axisXState.previous > 50 && this.axisXState.current < 50) {
            //   this.listeners.right.release();
            // }
            // if (this.axisXState.previous < -50 && this.axisXState.current > -50) {
            //   this.listeners.left.release();
            // }
            // other changes does not matter now:
            // pressed => pressed
            // released => released
        });
        this.readButtonsRequestId = window.requestAnimationFrame(this._readButtons.bind(this));
    }
    _stopReadingButtons() {
        window.cancelAnimationFrame(this.readButtonsRequestId);
    }
}
