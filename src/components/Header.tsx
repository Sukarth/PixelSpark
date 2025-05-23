
import React from 'react';
import { SettingsIcon } from './Icons'; // Assuming App.tsx passes onToggleSettings

interface HeaderProps {
  onToggleSettings?: () => void; // Optional prop to handle settings toggle
}

export const Header: React.FC<HeaderProps> = ({ onToggleSettings }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-md shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex-grow">
          PixelSpark ✨– ‎AI Vision Studio
        </h1>
        {onToggleSettings && (
          <button
            onClick={onToggleSettings}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-6 h-6 text-gray-300 hover:text-purple-400" />
          </button>
        )}
      </div>
    </header>
  );
};
