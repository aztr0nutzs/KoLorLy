
import React from 'react';
import { ColoringProvider } from './context/ColoringContext';
import Canvas from './components/Canvas';
import Header from './components/Header';
import Toolbox from './components/Toolbox';
import InspectorPanel from './components/InspectorPanel';
import Palette from './components/Palette';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  return (
    <ColoringProvider>
      <div className="h-screen w-screen bg-black text-gray-200 flex flex-col font-sans overflow-hidden">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          <Toolbox />
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-900/50 overflow-auto">
             <Canvas />
          </div>
          <InspectorPanel />
        </main>
        <Palette />
        <Onboarding />
      </div>
    </ColoringProvider>
  );
};

export default App;
