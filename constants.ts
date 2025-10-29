
import { BrushOptions, Tool } from './types';

export const DEFAULT_BRUSH_OPTIONS: BrushOptions = {
  size: 10,
  opacity: 1,
  flow: 1,
  hardness: 0.9,
};

export const INITIAL_COLOR = '#4b5563'; // Gray

export const DEFAULT_PALETTES = {
  'Primary': ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  'Pastel': ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe'],
  'Nature': ['#15803d', '#a16207', '#064e3b', '#3f6212', '#166534', '#854d0e'],
  'Grayscale': ['#111827', '#374151', '#6b7280', '#d1d5db', '#f3f4f6', '#ffffff'],
};

export const BLEND_MODES: GlobalCompositeOperation[] = [
    "source-over", "multiply", "screen", "overlay", "darken", 
    "lighten", "color-dodge", "color-burn", "hard-light", 
    "soft-light", "difference", "exclusion", "hue", 
    "saturation", "color", "luminosity"
];

export const TOOL_CONFIG = {
    [Tool.PENCIL]: { name: "Pencil" },
    [Tool.MARKER]: { name: "Marker" },
    [Tool.CRAYON]: { name: "Crayon" },
    [Tool.WATERCOLOR]: { name: "Watercolor" },
    [Tool.ERASER]: { name: "Eraser" },
    [Tool.FILL]: { name: "Fill Bucket" },
    [Tool.EYEDROPPER]: { name: "Eyedropper" },
    [Tool.PAN]: { name: "Pan/Zoom" },
}
