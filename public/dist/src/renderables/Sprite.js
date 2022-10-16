export class Sprite {
    constructor({ canvas, position, imageSrc, invertedImageSrc, scale = 1, framesMax = 1, animationSpeed = 1, offset = { x: 0, y: 0 }, }) {
        this.canvas = canvas;
        this.position = position;
        this.imageSrc = imageSrc;
        this.invertedImageSrc = invertedImageSrc;
        this.image = new Image();
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        // considering this runs at 60 FPS
        this.framesHold = Math.round(((60 / framesMax) * 1) / animationSpeed);
        this.offset = offset;
        if (imageSrc) {
            this.image.src = imageSrc;
        }
    }
    draw() {
        this.canvas.drawImage(this.image, this.framesCurrent * (this.image.width / this.framesMax), 0, this.image.width / this.framesMax, this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, (this.image.width / this.framesMax) * this.scale, this.image.height * this.scale);
    }
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
            else {
                this.framesCurrent = 0;
            }
        }
    }
    /**
     * Better not to use this method to invert image as this will cause a re-fetch for the image.
     * Altough browser can cache it it's probably not a better solution than having a separate sprite
     * for the inverted image at the cost of memory usage
     */
    invert() {
        this.image.src = this.invertedImageSrc || this.imageSrc;
    }
    /**
     * This is the method that gets called every frame to re-render Sprite
     * This method also contains the logics for the updateing positions, animations, inner workings and the drawing itself
     */
    update() {
        this.draw();
        this.animateFrames();
    }
}
