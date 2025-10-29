
import React, { useState, useEffect } from 'react';

const Onboarding: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-[100]">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Welcome to Zenith Coloring!</h2>
                <p className="text-gray-300 mb-6">
                    This is your digital coloring book. Use the toolbox on the left to select tools, pick colors from the bottom palette, and manage your layers on the right. Happy coloring!
                </p>
                <button
                    onClick={handleDismiss}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
                >
                    Start Coloring
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
