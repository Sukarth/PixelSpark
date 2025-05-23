import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Select } from './Select';
import { ExternalLinkIcon, CheckIcon, ExclamationTriangleIcon } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string, model: string) => void;
  currentApiKey: string;
  currentModel: string;
  availableModels: Array<{ key: string; label: string }>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentApiKey,
  currentModel,
  availableModels,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting'>('entering');

  useEffect(() => {
    setApiKey(currentApiKey);
    setSelectedModel(currentModel);
  }, [currentApiKey, currentModel, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationState('entering');
      // Start the animation immediately
      const timer = setTimeout(() => {
        setAnimationState('entered');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationState('exiting');
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setError(null);
    onSave(apiKey, selectedModel);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose(); // Trigger fade-out and close after success
    }, 2000);
  };

  if (!isVisible) {
    return null;
  }

  const modelOptions = availableModels.map(m => ({ value: m.key, label: m.label }));

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-overlay modal-overlay-${animationState}`}
      onClick={handleClose}
    >
      <div
        className={`bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 relative transform transition-all duration-300 ease-out scale-100 modal-content modal-content-${animationState}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
          aria-label="Close settings"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Settings</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-md text-sm flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-md text-sm flex items-center">
            <CheckIcon className="w-5 h-5 mr-2" />
            Settings saved successfully!
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Google AI API Key
            </label>
            <input
              type="password" // Use password type for API keys
              id="apiKey"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                if (error) setError(null); // Clear error on input change
              }}
              placeholder="Enter your API Key"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400 focus-subtle-pulse"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Your API key is stored locally in your browser and is never sent to our servers.
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-purple-400 hover:text-purple-300 underline inline-flex items-center"
              >
                Get an API Key <ExternalLinkIcon className="w-3 h-3 ml-1" />
              </a>
            </p>
          </div>

          <div>
            <Select
              label="Image Generation Model"
              options={modelOptions}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              containerClassName="focus-subtle-pulse rounded-md"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Select the Google AI model for image generation. 'Imagen 3.0' is recommended for best results.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
