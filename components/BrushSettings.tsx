
import React from 'react';
import { useColoringContext } from '../context/ColoringContext';

const BrushSettings: React.FC = () => {
    const { brushOptions, setBrushOptions } = useColoringContext();

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrushOptions({ [e.target.name]: parseFloat(e.target.value) });
    };

    return (
        <div className="p-4 space-y-4" data-doc-ref="brush-settings">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Size</label>
                <input
                    type="range"
                    name="size"
                    min="1"
                    max="100"
                    step="1"
                    value={brushOptions.size}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Opacity</label>
                <input
                    type="range"
                    name="opacity"
                    min="0"
                    max="1"
                    step="0.01"
                    value={brushOptions.opacity}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hardness</label>
                <input
                    type="range"
                    name="hardness"
                    min="0"
                    max="1"
                    step="0.01"
                    value={brushOptions.hardness}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default BrushSettings;
