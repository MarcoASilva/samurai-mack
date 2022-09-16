const testCommandListener = new CommandListener({
  left: "p",
  right: "o",
  jump: "i",
  attack: "u",
});

testCommandListener.on(
  "left",
  () => console.log("PRESSING LEFT"),
  () => console.log("RELEASED LEFT")
);
testCommandListener.start();

///

export const Paint =
  ({ canvas = CanvasRenderingContext2D(), canvasWidth, canvasHeight }) =>
  (name = "") => {
    const validPaintings = {
      background: "background",
      constrast: "constrast",
    };

    const paintings = {
      background: () => {
        canvas.fillStyle = "black";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
        return this;
      },
      constrast: () => {
        canvas.fillStyle = "rgba(255,255,255, 0.15)";
        canvas.fillRect(0, 0, canvasWidth, canvasHeight);
      },
      undefined: () => void 0,
    };

    return paintings[validPaintings[name]]();
  };

const paint = Paint({
  canvas: c,
  canvasWidth: canvasElement.width,
  canvasHeight: canvasElement.height,
});

paint("background");
