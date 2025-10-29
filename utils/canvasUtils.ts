
import { Point, Tool, BrushOptions } from '../types';

function hexToRgba(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b, a: 255 };
}

export function drawLine(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point,
    color: string,
    tool: Tool,
    options: BrushOptions
) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = options.opacity;

    if (tool === Tool.ERASER) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = options.size;
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        const pressure = end.pressure ?? 0.5;
        ctx.lineWidth = options.size * (pressure * 0.8 + 0.2); // Pressure affects size
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Reset composite operation for other tools
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
}

export function floodFill(
    ctx: CanvasRenderingContext2D,
    start: Point,
    fillColor: string,
    lineArtData: ImageData,
    tolerance: number
) {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const lineData = lineArtData.data;
    
    const startX = Math.floor(start.x);
    const startY = Math.floor(start.y);

    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos+1];
    const startB = data[startPos+2];
    
    const fillColorRgba = hexToRgba(fillColor);
    
    if (
        startR === fillColorRgba.r &&
        startG === fillColorRgba.g &&
        startB === fillColorRgba.b
    ) {
        return;
    }

    const queue: [number, number][] = [[startX, startY]];
    
    while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const currentPos = (y * width + x) * 4;

        // Check boundary from line art layer
        if (lineData[currentPos + 3] > 0) { // Check alpha of line art
            continue;
        }

        const r = data[currentPos];
        const g = data[currentPos + 1];
        const b = data[currentPos + 2];
        
        const colorDiff = Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB);

        if (colorDiff <= tolerance) {
            data[currentPos] = fillColorRgba.r;
            data[currentPos + 1] = fillColorRgba.g;
            data[currentPos + 2] = fillColorRgba.b;
            data[currentPos + 3] = 255;

            queue.push([x + 1, y]);
            queue.push([x - 1, y]);
            queue.push([x, y + 1]);
            queue.push([x, y - 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}
