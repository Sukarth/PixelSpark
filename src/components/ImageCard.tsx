
import React from 'react';
import { CheckCircleIcon } from './Icons';

interface ImageCardProps {
  imageData: { id: string; base64: string };
  isSelected: boolean;
  onSelect: (id: string) => void; // Changed to pass ID for multi-select management
  showCheckbox?: boolean;
  disabled?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  imageData, 
  isSelected, 
  onSelect, 
  showCheckbox = true,
  disabled = false 
}) => {
  const handleCardClick = () => {
    if (!disabled) {
      onSelect(imageData.id);
    }
  };
  
  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-xl group 
                  transition-all duration-300 ease-in-out transform hover:scale-105 
                  focus-within:ring-4 focus-within:ring-purple-500 focus-within:ring-opacity-75
                  ${isSelected ? 'ring-4 ring-purple-500' : 'ring-2 ring-gray-700 hover:ring-purple-600'}
                  ${disabled ? 'opacity-60 cursor-not-allowed filter grayscale' : 'cursor-pointer'}`}
      onClick={handleCardClick}
      onKeyPress={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select image ${imageData.id.slice(-6)}`}
      aria-disabled={disabled}
    >
      <img
        src={`data:image/png;base64,${imageData.base64}`}
        alt={`Generated image ${imageData.id.slice(-6)}`}
        className="w-full h-full object-cover aspect-square"
        loading="lazy"
      />
      {showCheckbox && (
        <div 
          className={`absolute top-3 right-3 transition-opacity duration-200 
                      ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <CheckCircleIcon 
            className={`w-8 h-8 ${isSelected ? 'text-purple-500 bg-white rounded-full' : 'text-gray-300 bg-gray-800 bg-opacity-50 rounded-full'}`} 
          />
        </div>
      )}
      {isSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none">
           {/* Optional: Add a stronger visual cue like an overlay checkmark */}
        </div>
      )}
    </div>
  );
};
