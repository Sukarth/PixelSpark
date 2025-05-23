
import React, { useState } from 'react';
import { GeneratedImageData } from '../types';
import { Button } from './Button';
import { ImageCard } from './ImageCard';
import { RefreshCwIcon, ArrowLeftIcon, SparklesIcon, WandSparklesIcon, CheckCircleIcon } from './Icons';

interface ImageSelectionScreenProps {
  images: GeneratedImageData[];
  prompt: string;
  onProceedWithSelection: (selectedImages: GeneratedImageData[]) => void;
  onRegenerate: () => void;
  onRefine: (refinementPrompt: string) => void;
  onBack: () => void;
  disabled?: boolean;
}

export const ImageSelectionScreen: React.FC<ImageSelectionScreenProps> = ({
  images,
  prompt,
  onProceedWithSelection,
  onRegenerate,
  onRefine,
  onBack,
  disabled = false,
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');
  const [showRefineInput, setShowRefineInput] = useState<boolean>(false);

  const handleImageToggleSelect = (id: string) => {
    setSelectedImageIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((imageId) => imageId !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleProceed = () => {
    const selected = images.filter(img => selectedImageIds.includes(img.id));
    if (selected.length > 0) {
      onProceedWithSelection(selected);
    }
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementPrompt.trim()) {
      onRefine(refinementPrompt);
      setRefinementPrompt('');
      setShowRefineInput(false);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-400 mb-4">No images were generated. This might be due to a restrictive prompt or an API issue.</p>
        <Button onClick={onBack} variant="secondary" leftIcon={<ArrowLeftIcon />} disabled={disabled}>
          Back to Prompt
        </Button>
      </div>
    );
  }

  const numSelected = selectedImageIds.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-gray-800/50 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-2 text-gray-100">Select Images for Processing</h2>
        <p className="text-sm text-gray-400 italic">
          Original Prompt: "{prompt}"
        </p>
        <p className="text-sm text-purple-300 mt-1">
          {numSelected > 0 ? `${numSelected} image(s) selected.` : "Click on images to select them."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {images.map((img) => (
          <ImageCard
            key={img.id}
            imageData={img}
            isSelected={selectedImageIds.includes(img.id)}
            onSelect={handleImageToggleSelect}
            showCheckbox={true}
            disabled={disabled}
          />
        ))}
      </div>
      
      <div className="sticky bottom-4 z-30 mt-8 p-4 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button 
            onClick={handleProceed} 
            variant="primary" 
            size="lg"
            disabled={numSelected === 0 || disabled}
            leftIcon={<CheckCircleIcon />}
        >
          Proceed with {numSelected > 0 ? `${numSelected} Image(s)` : 'Selection'}
        </Button>
        <Button onClick={onRegenerate} variant="secondary" leftIcon={<RefreshCwIcon />} disabled={disabled}>
          Regenerate All
        </Button>
        <Button onClick={() => setShowRefineInput(!showRefineInput)} variant="secondary" leftIcon={<WandSparklesIcon />} disabled={disabled}>
          {showRefineInput ? 'Cancel Refinement' : 'Refine Further'}
        </Button>
      </div>


      {showRefineInput && (
        <form onSubmit={handleRefineSubmit} className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out">
          <label htmlFor="refinementPrompt" className="block text-sm font-medium text-gray-300 mb-1">
            Refinement Prompt (add details or changes)
          </label>
          <textarea
            id="refinementPrompt"
            value={refinementPrompt}
            onChange={(e) => setRefinementPrompt(e.target.value)}
            rows={2}
            placeholder="e.g., make it more colorful, add a metallic texture"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400"
            disabled={disabled}
          />
          <Button type="submit" variant="primary" className="mt-3 w-full sm:w-auto" leftIcon={<SparklesIcon />} disabled={!refinementPrompt.trim() || disabled}>
            Generate with Refinement
          </Button>
        </form>
      )}

      <div className="mt-10 text-center">
        <Button onClick={onBack} variant="ghost" leftIcon={<ArrowLeftIcon />} disabled={disabled}>
          Back to Start (New Prompt)
        </Button>
      </div>
    </div>
  );
};
