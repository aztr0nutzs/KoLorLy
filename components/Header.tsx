
import React from 'react';
import { useColoringContext } from '../context/ColoringContext';
import { UndoIcon, RedoIcon } from './Icons';

const Header: React.FC = () => {
    const { undo, redo, canUndo, canRedo, getLayer } = useColoringContext();

    const handleUndo = () => {
        const prevState = undo();
        if (prevState) {
            const layer = getLayer(prevState.layerId);
            layer?.context.putImageData(prevState.imageData, 0, 0);
        }
    };

    const handleRedo = () => {
        const nextState = redo();
        if (nextState) {
            const layer = getLayer(nextState.layerId);
            layer?.context.putImageData(nextState.imageData, 0, 0);
        }
    };
    
    return (
        <header className="bg-gray-800 p-2 flex items-center justify-between shadow-md z-50">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Zenith Coloring</h1>
            </div>
            <div className="flex items-center gap-4">
                 {/* TODO: API for project save/load */}
                 <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm" data-doc-ref="project-save">Save</button>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleUndo} disabled={!canUndo} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <UndoIcon className="w-5 h-5" />
                </button>
                <button onClick={handleRedo} disabled={!canRedo} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <RedoIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
