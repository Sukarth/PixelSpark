
import React from 'react';
import { WandSparklesIcon } from './Icons';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="animate-pulse">
        <WandSparklesIcon className="w-16 h-16 text-purple-400" />
      </div>
      <p className="mt-4 text-xl font-semibold text-gray-200">{message}</p>
      <div className="mt-2 w-32 h-2 bg-purple-500 rounded-full overflow-hidden">
        <div className="h-full bg-purple-300 animate-loading-bar"></div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};
