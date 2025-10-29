
import React from 'react';
import { useColoringContext } from '../context/ColoringContext';
import { AddLayerIcon, RemoveLayerIcon, VisibleIcon, NotVisibleIcon } from './Icons';
import { BLEND_MODES } from '../constants';

const LayersPanel: React.FC = () => {
    const { layers, activeLayerId, dispatchLayers } = useColoringContext();

    const addLayer = () => {
        const id = `layer-${Date.now()}`;
        const canvas = document.createElement('canvas');
        const activeLayer = layers.find(l => l.id === activeLayerId);
        if (activeLayer) {
            canvas.width = activeLayer.canvas.width;
            canvas.height = activeLayer.canvas.height;
        } else {
            // Fallback size
            canvas.width = 1000;
            canvas.height = 1200;
        }
        const context = canvas.getContext('2d');
        if (context) {
            dispatchLayers({
                type: 'ADD_LAYER',
                payload: { id, name: `Layer ${layers.length + 1}`, canvas, context },
            });
        }
    };
    
    const removeLayer = (id: string) => {
        dispatchLayers({ type: 'REMOVE_LAYER', payload: { id } });
    };

    const setActiveLayer = (id: string) => {
        dispatchLayers({ type: 'SET_ACTIVE_LAYER', payload: { id } });
    };

    const updateLayer = (id: string, updates: any) => {
        dispatchLayers({ type: 'UPDATE_LAYER', payload: { id, updates } });
    };

    return (
        <div className="flex flex-col h-full" data-doc-ref="layers-panel">
            <div className="flex-1 overflow-y-auto">
                {layers.slice().reverse().map(layer => (
                    <div
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`p-2 border-b border-gray-700 cursor-pointer ${activeLayerId === layer.id ? 'bg-blue-900/50' : 'hover:bg-gray-700/50'}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm">{layer.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { isVisible: !layer.isVisible }); }}>
                                    {layer.isVisible ? <VisibleIcon className="w-5 h-5"/> : <NotVisibleIcon className="w-5 h-5"/>}
                                </button>
                                {layers.length > 1 && (
                                     <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}>
                                        <RemoveLayerIcon className="w-5 h-5 text-red-400 hover:text-red-500"/>
                                    </button>
                                )}
                            </div>
                        </div>
                         <div className="mt-2">
                            <label className="text-xs text-gray-400">Opacity</label>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={layer.opacity}
                                onChange={(e) => { e.stopPropagation(); updateLayer(layer.id, { opacity: parseFloat(e.target.value) }); }}
                                className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="mt-2">
                             <label className="text-xs text-gray-400">Blend Mode</label>
                             <select 
                                value={layer.blendMode}
                                onChange={e => { e.stopPropagation(); updateLayer(layer.id, { blendMode: e.target.value as GlobalCompositeOperation })}}
                                className="w-full bg-gray-900 text-xs rounded border border-gray-600 p-1"
                             >
                                {BLEND_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                             </select>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-gray-700">
                <button onClick={addLayer} className="w-full flex items-center justify-center gap-2 p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded">
                    <AddLayerIcon className="w-5 h-5" /> Add Layer
                </button>
            </div>
        </div>
    );
};

export default LayersPanel;
