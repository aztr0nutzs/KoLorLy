
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useColoringContext } from '../context/ColoringContext';
import { Point, Tool } from '../types';
import { drawLine, floodFill } from '../utils/canvasUtils';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1200;

const Canvas: React.FC = () => {
    const { 
        currentTool,
        currentColor, 
        brushOptions,
        layers,
        activeLayerId,
        dispatchLayers,
        getActiveLayer,
        pushToHistory,
        getLayer,
    } = useColoringContext();

    const containerRef = useRef<HTMLDivElement>(null);
    const lineArtCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState<Point | null>(null);

    // Init: Create line art and first drawing layer
    useEffect(() => {
        const lineArtCtx = lineArtCanvasRef.current?.getContext('2d');
        if (lineArtCtx) {
            const img = new Image();
            img.onload = () => {
                lineArtCtx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                 if (layers.length === 0) {
                    const id = `layer-${Date.now()}`;
                    const canvas = document.createElement('canvas');
                    canvas.width = CANVAS_WIDTH;
                    canvas.height = CANVAS_HEIGHT;
                    const context = canvas.getContext('2d');
                    if (context) {
                        dispatchLayers({ type: 'ADD_LAYER', payload: { id, name: "Color Layer 1", canvas, context } });
                    }
                }
            };
            // Placeholder coloring page
            img.src = "https://i.imgur.com/gQY1a3G.png"; // A simple mandala design
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCanvasPoint = (e: React.PointerEvent<HTMLDivElement>): Point | null => {
        const container = containerRef.current;
        if (!container) return null;
        const rect = container.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / (rect.width / CANVAS_WIDTH),
            y: (e.clientY - rect.top) / (rect.height / CANVAS_HEIGHT),
            pressure: e.pressure
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        const point = getCanvasPoint(e);
        if (!point) return;
        
        const activeLayer = getActiveLayer();
        if (!activeLayer) return;

        setIsDrawing(true);
        setLastPoint(point);

        if (currentTool === Tool.FILL) {
             // Save state before filling
            const imageData = activeLayer.context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            pushToHistory({ layerId: activeLayer.id, imageData });
            
            const lineArtData = lineArtCanvasRef.current?.getContext('2d')?.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            if(lineArtData) {
                floodFill(activeLayer.context, point, currentColor, lineArtData, 30);
            }
            setIsDrawing(false);
        } else {
             // Save state before drawing
            const imageData = activeLayer.context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            pushToHistory({ layerId: activeLayer.id, imageData });

            // Start drawing line
            drawLine(activeLayer.context, point, point, currentColor, currentTool, brushOptions);
        }
    };
    
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDrawing || !lastPoint) return;
        const point = getCanvasPoint(e);
        if (!point) return;

        const activeLayer = getActiveLayer();
        if (!activeLayer) return;
        
        if(currentTool !== Tool.FILL) {
            drawLine(activeLayer.context, lastPoint, point, currentColor, currentTool, brushOptions);
            setLastPoint(point);
        }
    };
    
    const handlePointerUp = () => {
        setIsDrawing(false);
        setLastPoint(null);
    };

    return (
        <div
            ref={containerRef}
            className="relative shadow-lg aspect-[1000/1200] w-full max-w-full md:max-w-3xl lg:max-w-4xl touch-none bg-white"
            style={{ imageRendering: 'pixelated' }} // For crisp pixels on zoom
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <canvas
                ref={lineArtCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
            />
            {layers.map((layer, index) => (
                <canvas
                    key={layer.id}
                    ref={el => { if (el) layer.canvas = el; }}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                        zIndex: index + 1,
                        opacity: layer.opacity,
                        mixBlendMode: layer.blendMode,
                        display: layer.isVisible ? 'block' : 'none',
                    }}
                />
            ))}
        </div>
    );
};

export default Canvas;
