import { imagedata, colors } from "./raw.mjs";
import { Context, Element } from "svgcanvas";

const render = (context2D, SCALE = 3) => {

    // more options to pass into constructor:
    const options = {
        height: context2D.width, // falsy values get converted to 500
        width: context2D.height, // falsy values get converted to 500
        ctx: context2D, // existing Context2D to wrap around
        enableMirroring: false, // whether canvas mirroring (get image data) is enabled (defaults to false)
        document: undefined, // overrides default document object
    };

    // Creates a mock canvas context (mocks `context2D` above)
    const ctx = new Context(options);


    ctx.save();
    ctx.scale(1, 1.07);

    const toScreen = (x, y) => {
        const screenX = x * SCALE;
        const screenY = y * SCALE;
        return [screenX, screenY];
    }

    function floodFill(context, x, y, fillColorString) {
        // get 2d context
        // get image data
        // const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
        // // Construct flood fill instance
        // const floodFill = new FloodFill(imgData);
        // // Modify image data
        // floodFill.fill(fillColorString, x, y, 250)
        // // put the modified data back in context
        // context.putImageData(floodFill.imageData, 0, 0)
    }

    let p = 0;
    while (p < imagedata.length) {
        const byte1 = imagedata[p++];
        const byte2 = imagedata[p++];
        if (byte1 == 0xFF && byte2 == 0xFF) {
            console.log("End of image data");
            break;
        }
        if (byte1 == 0xFF && byte2 != 0xFF) {
            const line = [];
            while (p < imagedata.length) {
                const byte3 = imagedata[p++];
                const byte4 = imagedata[p++];
                if (byte3 == 0xFF || byte3 == 0xFE) {
                    p -= 2
                    break;
                }
                line.push([byte3, byte4]);
            }
            console.log("Drawing line with color", byte2, "at", line);
            ctx.strokeStyle = colors[byte2];
            ctx.lineWidth = SCALE;
            ctx.lineCap = "square";
            ctx.lineJoin = "round";
            ctx.beginPath();
            line.forEach(([x, y]) => {
                const [screenX, screenY] = toScreen(x, y);
                ctx.lineTo(screenX, screenY);
            });
            ctx.stroke();
        }
        if (byte1 == 0xFE) {
            const posx = imagedata[p++];
            const posy = imagedata[p++];
            console.log("Fill with color", byte2, "at", posx.toString(16), posy.toString(16));
            ctx.restore();
            // Floodfill does not respect transformations
            floodFill(ctx, ...toScreen(posx, posy * 1.125), colors[byte2]);
            ctx.save();
            ctx.scale(1, 1.125);
        }
        if (byte1 != 0xFF && byte1 != 0xFE) {
            console.log("Unknown command", byte1, byte2);
        }
    }
    console.log(ctx.getSerializedSvg())
};

window.__render = render;
