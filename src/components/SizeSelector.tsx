
import React from 'react';
import { SizeOption } from '../types';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { ExclamationTriangleIcon } from './Icons'; // Ensure this is imported if used

interface SizeSelectorProps {
  availableSizes: SizeOption[];
  selectedSizeKeys: string[];
  onChange: (selectedKeys: string[]) => void;
  aspectRatioLabel: string;
  disabled?: boolean;
  context?: 'promptForm' | 'finalizeScreen'; // To conditionally show warnings
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  availableSizes,
  selectedSizeKeys,
  onChange,
  aspectRatioLabel,
  disabled = false,
  context = 'finalizeScreen',
}) => {
  const handleCheckboxChange = (sizeKey: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedSizeKeys, sizeKey]);
    } else {
      onChange(selectedSizeKeys.filter((key) => key !== sizeKey));
    }
  };

  const handleSelectAll = () => {
    onChange(availableSizes.map(size => size.key));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  if (!availableSizes || availableSizes.length === 0) {
    return <p className="text-sm text-gray-400">No specific sizes configured for {aspectRatioLabel}. Default output will be based on the generated image.</p>;
  }

  const showNoSizesSelectedWarning = context === 'promptForm' && selectedSizeKeys.length === 0 && availableSizes.length > 0 && !disabled;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-200">
        Select Output Sizes <span className="text-sm text-purple-400">({aspectRatioLabel})</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {availableSizes.map((size) => (
          <Checkbox
            key={size.key}
            id={`size-${size.key}-${context}`} // Ensure unique IDs if component is used multiple times
            label={size.label}
            checked={selectedSizeKeys.includes(size.key)}
            onChange={(e) => handleCheckboxChange(size.key, e.target.checked)}
            disabled={disabled}
            containerClassName="p-3 bg-gray-700/50 rounded-md border border-gray-600 hover:border-purple-500 transition-colors"
            labelClassName="text-gray-200 text-xs sm:text-sm"
          />
        ))}
      </div>
      {availableSizes.length > 1 && (
        <div className="flex items-center space-x-3 mt-3">
          <Button onClick={handleSelectAll} variant="ghost" size="sm" disabled={disabled}>
            Select All
          </Button>
          <Button onClick={handleDeselectAll} variant="ghost" size="sm" disabled={disabled || selectedSizeKeys.length === 0}>
            Deselect All
          </Button>
        </div>
      )}
      {showNoSizesSelectedWarning && (
        <div className="mt-3 p-2.5 bg-yellow-900/40 border border-yellow-700/50 rounded-md text-xs text-yellow-300 flex items-start">
          <ExclamationTriangleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
          <span>
            No specific output sizes selected. Images will be generated at the chosen aspect ratio. You can select desired download sizes after images are generated.
          </span>
        </div>
      )}
    </div>
  );
};