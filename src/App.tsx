
import React, { useState, useEffect, useCallback } from 'react';
import { AppScreen, GeneratedImageData, SizeOption, ProcessedImageGroup } from './types';
import { ASPECT_RATIOS, AVAILABLE_IMAGE_MODELS, LOCAL_STORAGE_API_KEY, LOCAL_STORAGE_MODEL_KEY } from './constants';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PromptForm } from './components/PromptForm';
import { ImageSelectionScreen } from './components/ImageSelectionScreen';
import { FinalizeScreen } from './components/FinalizeScreen';
import { SettingsModal } from './components/SettingsModal';
import { generateImagesFromPrompt } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { cropImageToAspectRatio, resizeImage } from './utils/imageUtils';
import { ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.PROMPT_INPUT);

  const [userApiKey, setUserApiKey] = useState<string | null>(null);
  const [selectedApiModel, setSelectedApiModel] = useState<string>(AVAILABLE_IMAGE_MODELS[0].key);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const [prompt, setPrompt] = useState<string>('');
  const [selectedAspectRatioKey, setSelectedAspectRatioKey] = useState<string>(ASPECT_RATIOS[0].key);
  const [selectedSizeKeys, setSelectedSizeKeys] = useState<string[]>(() => ASPECT_RATIOS[0].defaultSizes.map(s => s.key));

  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [selectedImagesForProcessing, setSelectedImagesForProcessing] = useState<GeneratedImageData[]>([]);

  const [finalProcessedGroups, setFinalProcessedGroups] = useState<ProcessedImageGroup[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Generating images...');
  const [error, setError] = useState<string | null>(null);
  const [apiKeyWarning, setApiKeyWarning] = useState<string | null>(null);


  useEffect(() => {
    const storedApiKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
    const storedModel = localStorage.getItem(LOCAL_STORAGE_MODEL_KEY);

    if (storedApiKey) {
      setUserApiKey(storedApiKey);
    } else {
      setApiKeyWarning("API Key not set. Please configure it in Settings to enable image generation.");
      // Don't automatically open settings modal on first load
      // Just show the warning and let the user click the settings button themselves
    }

    if (storedModel && AVAILABLE_IMAGE_MODELS.some(m => m.key === storedModel)) {
      setSelectedApiModel(storedModel);
    }
  }, []);

  const handleSaveSettings = (newApiKey: string, newModel: string) => {
    setUserApiKey(newApiKey);
    setSelectedApiModel(newModel);
    localStorage.setItem(LOCAL_STORAGE_API_KEY, newApiKey);
    localStorage.setItem(LOCAL_STORAGE_MODEL_KEY, newModel);
    setIsSettingsModalOpen(false);
    setApiKeyWarning(null); // Clear warning once key is set
    setError(null); // Clear previous errors
  };

  const currentAspectRatio = ASPECT_RATIOS.find(ar => ar.key === selectedAspectRatioKey) || ASPECT_RATIOS[0];

  const handleGenerate = async (currentPrompt: string, currentAspectRatioKey: string, currentSizeKeys: string[]) => {
    if (!userApiKey) {
      setError("Cannot generate images: API Key is not configured.");
      setApiKeyWarning("API Key is missing. Please set it in Settings.");
      setIsSettingsModalOpen(true);
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating images...');
    setError(null);
    setApiKeyWarning(null);
    setPrompt(currentPrompt);
    setSelectedAspectRatioKey(currentAspectRatioKey);
    setSelectedSizeKeys(currentSizeKeys);
    setGeneratedImages([]);
    setSelectedImagesForProcessing([]);
    setFinalProcessedGroups([]);

    try {
      const fullPrompt = `${currentPrompt}, digital art, ${currentAspectRatio.label}`;
      // Pass userApiKey and selectedApiModel to the service
      const images = await generateImagesFromPrompt(fullPrompt, userApiKey, selectedApiModel, 4);
      setGeneratedImages(images.map((base64, index) => ({ id: `gen-${Date.now()}-${index}`, base64 })));
      setCurrentScreen(AppScreen.IMAGE_SELECTION);
    } catch (err) {
      console.error("Error generating images:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
      if (err instanceof Error && (err.message.toLowerCase().includes("api key") || err.message.toLowerCase().includes("permission denied"))) {
        setApiKeyWarning("Invalid API Key or permission issue. Please check your key in Settings.");
        setIsSettingsModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!prompt) return;
    await handleGenerate(prompt, selectedAspectRatioKey, selectedSizeKeys);
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!prompt) return;
    const newPrompt = `${prompt}. Refinement: ${refinementPrompt}`;
    setPrompt(newPrompt);
    await handleGenerate(newPrompt, selectedAspectRatioKey, selectedSizeKeys);
  };

  const processImageForFinalization = useCallback(async (imageToProcess: GeneratedImageData, sizesToGenerate: SizeOption[]) => {
    setIsLoading(true);
    setLoadingMessage(`Processing ${currentAspectRatio.label} image (ID: ${imageToProcess.id.slice(-4)})...`);

    let baseForSizing = imageToProcess.base64;

    if (currentAspectRatio.widthRatio !== 1 || currentAspectRatio.heightRatio !== 1) {
      try {
        baseForSizing = await cropImageToAspectRatio(imageToProcess.base64, currentAspectRatio.widthRatio, currentAspectRatio.heightRatio);
      } catch (cropError) {
        console.error("Error cropping image:", cropError);
        setError(`Failed to crop image ${imageToProcess.id} to aspect ratio.`);
        return null;
      }
    }

    const processedVersions = await Promise.all(
      sizesToGenerate.map(async (sizeOpt) => {
        try {
          const resizedDataUrl = await resizeImage(baseForSizing, sizeOpt.width, sizeOpt.height);
          return {
            sizeKey: sizeOpt.key,
            sizeLabel: sizeOpt.label,
            width: sizeOpt.width,
            height: sizeOpt.height,
            dataUrl: resizedDataUrl,
          };
        } catch (resizeError) {
          console.error(`Error resizing ${imageToProcess.id} to ${sizeOpt.label}:`, resizeError);
          return {
            sizeKey: sizeOpt.key,
            sizeLabel: `${sizeOpt.label} (Error)`,
            width: sizeOpt.width,
            height: sizeOpt.height,
            dataUrl: '',
          };
        }
      })
    );

    return {
      originalId: imageToProcess.id,
      originalBase64: imageToProcess.base64,
      processed: processedVersions.filter(p => p.dataUrl !== ''),
    };
  }, [currentAspectRatio]);


  const handleProceedWithSelections = async (selectedGenImages: GeneratedImageData[]) => {
    setSelectedImagesForProcessing(selectedGenImages);

    const sizesForCurrentAR = currentAspectRatio.defaultSizes.filter(s => selectedSizeKeys.includes(s.key));
    let sizesToProcess = sizesForCurrentAR;

    if (sizesForCurrentAR.length === 0 && currentAspectRatio.defaultSizes.length > 0) {
      sizesToProcess = currentAspectRatio.defaultSizes;
      setSelectedSizeKeys(sizesToProcess.map(s => s.key));
    }

    if (sizesToProcess.length === 0 && selectedGenImages.length > 0) {
      setFinalProcessedGroups([]);
      setCurrentScreen(AppScreen.FINALIZE_DOWNLOAD);
      return;
    }

    setIsLoading(true);
    setLoadingMessage(`Processing ${selectedGenImages.length} image(s)...`);
    const allProcessedGroups: ProcessedImageGroup[] = [];
    for (const image of selectedGenImages) {
      const processedGroup = await processImageForFinalization(image, sizesToProcess);
      if (processedGroup) {
        allProcessedGroups.push(processedGroup);
      }
    }
    setFinalProcessedGroups(allProcessedGroups);
    setIsLoading(false);

    if (allProcessedGroups.length > 0) {
      setCurrentScreen(AppScreen.FINALIZE_DOWNLOAD);
    } else if (selectedGenImages.length > 0) {
      setError("Failed to process any of the selected images. Please try again or select different images.");
    }
  };

  const handleFinalizeSizes = async (newSizeKeys: string[]) => {
    setSelectedSizeKeys(newSizeKeys);
    if (selectedImagesForProcessing.length > 0) {
      const sizes = currentAspectRatio.defaultSizes.filter(s => newSizeKeys.includes(s.key));
      if (sizes.length === 0 && currentAspectRatio.defaultSizes.length > 0) {
        setFinalProcessedGroups(prevGroups => prevGroups.map(group => ({ ...group, processed: [] })));
        return;
      }

      setError(null);
      setIsLoading(true);
      setLoadingMessage(`Re-processing ${selectedImagesForProcessing.length} image(s) with new sizes...`);

      const allProcessedGroups: ProcessedImageGroup[] = [];
      for (const image of selectedImagesForProcessing) {
        const processedGroup = await processImageForFinalization(image, sizes);
        if (processedGroup) {
          allProcessedGroups.push(processedGroup);
        }
      }
      setFinalProcessedGroups(allProcessedGroups);
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setPrompt('');
    setGeneratedImages([]);
    setSelectedImagesForProcessing([]);
    setFinalProcessedGroups([]);
    setError(null);
    setSelectedAspectRatioKey(ASPECT_RATIOS[0].key);
    setSelectedSizeKeys(ASPECT_RATIOS[0].defaultSizes.map(s => s.key));
    setCurrentScreen(AppScreen.PROMPT_INPUT);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.PROMPT_INPUT:
        return (
          <PromptForm
            initialPrompt={prompt}
            initialAspectRatioKey={selectedAspectRatioKey}
            initialSizeKeys={selectedSizeKeys}
            aspectRatios={ASPECT_RATIOS}
            onGenerate={handleGenerate}
            disabled={!userApiKey || isLoading} // Disabled if no API key or loading
          />
        );
      case AppScreen.IMAGE_SELECTION:
        return (
          <ImageSelectionScreen
            images={generatedImages}
            prompt={prompt}
            onProceedWithSelection={handleProceedWithSelections}
            onRegenerate={handleRegenerate}
            onRefine={handleRefine}
            onBack={handleStartOver}
            disabled={isLoading || !userApiKey}
          />
        );
      case AppScreen.FINALIZE_DOWNLOAD:
        return (
          <FinalizeScreen
            processedImageGroups={finalProcessedGroups}
            aspectRatio={currentAspectRatio}
            selectedSizeKeys={selectedSizeKeys}
            onSizeSelectionChange={handleFinalizeSizes}
            onStartOver={handleStartOver}
            onBack={() => setCurrentScreen(AppScreen.IMAGE_SELECTION)}
            isLoading={isLoading}
          />
        );
      default:
        return <div className="text-red-500">Error: Unknown screen state.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100">
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <Header onToggleSettings={() => setIsSettingsModalOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {apiKeyWarning && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 max-w-md w-full">
            <ExclamationTriangleIcon className="h-6 w-6 text-black" />
            <span className="text-sm">{apiKeyWarning}</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="ml-auto text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded"
            >
              Open Settings
            </button>
            <button onClick={() => setApiKeyWarning(null)} className="ml-2 text-lg font-bold">&times;</button>
          </div>
        )}
        {error && !apiKeyWarning && ( // Only show general error if not an API key warning already shown
          <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg z-50 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-sm font-semibold hover:bg-red-600 p-1 rounded">Dismiss</button>
          </div>
        )}
        <div className="page-enter-active">
          {renderScreen()}
        </div>
      </main>
      <Footer />
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveSettings}
          currentApiKey={userApiKey || ''}
          currentModel={selectedApiModel}
          availableModels={AVAILABLE_IMAGE_MODELS}
        />
      )}
    </div>
  );
};

export default App;
