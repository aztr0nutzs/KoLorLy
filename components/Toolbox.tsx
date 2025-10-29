
import React from 'react';
import { useColoringContext } from '../context/ColoringContext';
import { Tool } from '../types';
import { TOOL_CONFIG } from '../constants';
import { PencilIcon, MarkerIcon, CrayonIcon, WatercolorIcon, EraserIcon, FillIcon, EyedropperIcon, PanIcon } from './Icons';

const toolIcons: Record<Tool, React.FC<{className: string}>> = {
    [Tool.PENCIL]: PencilIcon,
    [Tool.MARKER]: MarkerIcon,
    [Tool.CRAYON]: CrayonIcon,
    [Tool.WATERCOLOR]: WatercolorIcon,
    [Tool.ERASER]: EraserIcon,
    [Tool.FILL]: FillIcon,
    [Tool.EYEDROPPER]: EyedropperIcon,
    [Tool.PAN]: PanIcon,
};

const Toolbox: React.FC = () => {
    const { currentTool, setCurrentTool } = useColoringContext();

    return (
        <aside className="bg-gray-800 p-2 flex flex-col items-center gap-2" data-doc-ref="toolbox">
            {(Object.keys(toolIcons) as Tool[]).map(tool => {
                const Icon = toolIcons[tool];
                const isActive = currentTool === tool;
                return (
                    <button
                        key={tool}
                        onClick={() => setCurrentTool(tool)}
                        className={`p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                        title={TOOL_CONFIG[tool].name}
                    >
                        <Icon className="w-6 h-6" />
                    </button>
                );
            })}
        </aside>
    );
};

export default Toolbox;
