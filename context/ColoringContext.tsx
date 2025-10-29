
import React, { createContext, useContext, useState, useReducer, useCallback } from 'react';
import { BrushOptions, Tool, Layer, HistoryState } from '../types';
import { DEFAULT_BRUSH_OPTIONS, INITIAL_COLOR } from '../constants';

interface ColoringState {
  currentTool: Tool;
  currentColor: string;
  brushOptions: BrushOptions;
  layers: Layer[];
  activeLayerId: string | null;
  history: HistoryState[];
  historyIndex: number;
}

interface ColoringContextType extends ColoringState {
  setCurrentTool: (tool: Tool) => void;
  setCurrentColor: (color: string) => void;
  setBrushOptions: (options: Partial<BrushOptions>) => void;
  dispatchLayers: React.Dispatch<LayerAction>;
  getLayer: (id: string) => Layer | undefined;
  getActiveLayer: () => Layer | undefined;
  pushToHistory: (state: HistoryState) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  canUndo: boolean;
  canRedo: boolean;
}

const ColoringContext = createContext<ColoringContextType | undefined>(undefined);

type LayerAction =
  | { type: 'ADD_LAYER'; payload: { id: string; name: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } }
  | { type: 'REMOVE_LAYER'; payload: { id: string } }
  | { type: 'UPDATE_LAYER'; payload: { id: string; updates: Partial<Omit<Layer, 'id' | 'canvas' | 'context'>> } }
  | { type: 'REORDER_LAYERS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'SET_ACTIVE_LAYER'; payload: { id: string } }
  | { type: 'LOAD_LAYERS'; payload: { layers: Layer[], activeLayerId: string | null } };


const layerReducer = (state: {layers: Layer[], activeLayerId: string | null}, action: LayerAction) => {
  switch (action.type) {
    case 'ADD_LAYER': {
      const newLayer = { ...action.payload, isVisible: true, opacity: 1, blendMode: 'source-over' as GlobalCompositeOperation };
      const newLayers = [...state.layers, newLayer];
      return { layers: newLayers, activeLayerId: newLayer.id };
    }
    case 'REMOVE_LAYER': {
       if (state.layers.length <= 1) return state;
       const newLayers = state.layers.filter(l => l.id !== action.payload.id);
       let newActiveId = state.activeLayerId;
       if (state.activeLayerId === action.payload.id) {
           const removedIndex = state.layers.findIndex(l => l.id === action.payload.id);
           newActiveId = newLayers[Math.max(0, removedIndex - 1)]?.id || null;
       }
       return { layers: newLayers, activeLayerId: newActiveId };
    }
    case 'UPDATE_LAYER': {
      const newLayers = state.layers.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l);
      return { ...state, layers: newLayers };
    }
    case 'REORDER_LAYERS': {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...state, layers: result };
    }
    case 'SET_ACTIVE_LAYER':
      return { ...state, activeLayerId: action.payload.id };
    case 'LOAD_LAYERS':
      return { layers: action.payload.layers, activeLayerId: action.payload.activeLayerId };
    default:
      return state;
  }
};


export const ColoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<Tool>(Tool.PENCIL);
  const [currentColor, setCurrentColor] = useState<string>(INITIAL_COLOR);
  const [brushOptions, setBrushOptionsState] = useState<BrushOptions>(DEFAULT_BRUSH_OPTIONS);
  
  const [layerState, dispatchLayers] = useReducer(layerReducer, { layers: [], activeLayerId: null });
  const { layers, activeLayerId } = layerState;

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const setBrushOptions = (options: Partial<BrushOptions>) => {
    setBrushOptionsState(prev => ({ ...prev, ...options }));
  };

  const getLayer = useCallback((id: string) => layers.find(l => l.id === id), [layers]);
  const getActiveLayer = useCallback(() => layers.find(l => l.id === activeLayerId), [layers, activeLayerId]);

  const canUndo = historyIndex > -1;
  const canRedo = historyIndex < history.length - 1;

  const pushToHistory = useCallback((state: HistoryState) => {
    setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(state);
        return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (!canUndo) return null;
    const prevState = history[historyIndex];
    setHistoryIndex(prev => prev - 1);
    return prevState;
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    const nextState = history[historyIndex + 1];
    setHistoryIndex(prev => prev + 1);
    return nextState;
  }, [canRedo, history, historyIndex]);

  const value = {
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    brushOptions,
    setBrushOptions,
    layers,
    activeLayerId,
    dispatchLayers,
    getLayer,
    getActiveLayer,
    history,
    historyIndex,
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  };

  return <ColoringContext.Provider value={value}>{children}</ColoringContext.Provider>;
};

export const useColoringContext = () => {
  const context = useContext(ColoringContext);
  if (!context) {
    throw new Error('useColoringContext must be used within a ColoringProvider');
  }
  return context;
};
