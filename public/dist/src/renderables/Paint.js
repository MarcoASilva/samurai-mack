export class Paint {
    constructor({ canvas = new CanvasRenderingContext2D(), x, y, width, height, color = 'black', }) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw() {
        this.canvas.fillStyle = this.color;
        this.canvas.fillRect(this.x, this.y, this.width, this.height);
    }
    animateFrames() { }
    update() {
        this.draw();
    }
}
