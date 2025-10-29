
export enum Tool {
  PENCIL = 'pencil',
  MARKER = 'marker',
  CRAYON = 'crayon',
  WATERCOLOR = 'watercolor',
  ERASER = 'eraser',
  FILL = 'fill',
  EYEDROPPER = 'eyedropper',
  PAN = 'pan',
}

export interface BrushOptions {
  size: number;
  opacity: number;
  flow: number;
  hardness: number;
}

export interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  isVisible: boolean;
  opacity: number;
  blendMode: GlobalCompositeOperation;
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export type HistoryState = {
  layerId: string;
  imageData: ImageData;
};
