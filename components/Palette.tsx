
import React, { useState } from 'react';
import { useColoringContext } from '../context/ColoringContext';
import { DEFAULT_PALETTES } from '../constants';
import { ColorPickerIcon, GenerateIcon } from './Icons';
import { generateNewColoringPage } from '../services/geminiService';


const Palette: React.FC = () => {
    const { currentColor, setCurrentColor } = useColoringContext();
    const [activePalette, setActivePalette] = useState(Object.keys(DEFAULT_PALETTES)[0]);

    const handleGeneratePage = async () => {
        // TODO: Add a prompt input for the user
        alert("AI Page Generation is a future feature. A placeholder will be loaded.");
        // TODO: API call to generate a new coloring page and load it onto the canvas
        // This is a placeholder for where the Gemini API call would go.
        const pageUrl = await generateNewColoringPage("A magical forest with glowing mushrooms");
        console.log("New page URL (mock):", pageUrl);
        // We would then need logic in the Canvas component to load this new image.
    };

    return (
        <footer className="bg-gray-800 p-2 flex items-center gap-4 shadow-inner" data-doc-ref="palette">
            <div className="relative">
                <label
                    htmlFor="color-picker"
                    className="w-10 h-10 rounded-full border-2 border-gray-500 cursor-pointer flex items-center justify-center hover:border-white"
                    style={{ backgroundColor: currentColor }}
                    title="Select Color"
                >
                  <ColorPickerIcon className="w-6 h-6 text-white mix-blend-difference"/>
                </label>
                <input
                    id="color-picker"
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
            
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                {Object.keys(DEFAULT_PALETTES).map(name => (
                    <button 
                        key={name}
                        onClick={() => setActivePalette(name)}
                        className={`px-3 py-1 text-sm rounded ${activePalette === name ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex items-center gap-2">
                 {(DEFAULT_PALETTES[activePalette as keyof typeof DEFAULT_PALETTES] || []).map(color => (
                    <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${currentColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>

            <div className="border-l border-gray-700 pl-4">
                 {/* TODO: API to generate new coloring pages */}
                 <button onClick={handleGeneratePage} className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm" data-doc-ref="ai-generate-page">
                    <GenerateIcon className="w-5 h-5"/>
                    Generate Page
                 </button>
            </div>
        </footer>
    );
};

export default Palette;
