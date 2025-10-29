
import React, { useState } from 'react';
import BrushSettings from './BrushSettings';
import LayersPanel from './LayersPanel';

type Tab = 'brush' | 'layers';

const InspectorPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('brush');

    return (
        <aside className="bg-gray-800 w-72 flex flex-col" data-doc-ref="inspector-panel">
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('brush')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'brush' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                >
                    Brush
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'layers' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                >
                    Layers
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'brush' && <BrushSettings />}
                {activeTab === 'layers' && <LayersPanel />}
            </div>
        </aside>
    );
};

export default InspectorPanel;
