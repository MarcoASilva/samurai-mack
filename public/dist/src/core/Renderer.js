export class Renderer {
    /**
     * **IMPORTANT:** order matters here as the sprites will be rendered one upon another.
     * So the index means the "z-index" of each sprite in the array
     */
    constructor({ sprites }) {
        this.sprites = sprites;
    }
    update() {
        this.sprites.forEach(sprite => sprite.update());
    }
}
