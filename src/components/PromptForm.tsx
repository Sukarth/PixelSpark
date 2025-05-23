
import React, { useState, useEffect, useRef } from 'react';
import { AspectRatioOption } from '../types';
import { Button } from './Button';
import { Select } from './Select';
import { SizeSelector } from './SizeSelector';
import { WandSparklesIcon, ExclamationTriangleIcon } from './Icons';

interface PromptFormProps {
  initialPrompt?: string;
  initialAspectRatioKey?: string;
  initialSizeKeys?: string[];
  aspectRatios: AspectRatioOption[];
  onGenerate: (prompt: string, aspectRatioKey: string, sizeKeys: string[]) => void;
  disabled?: boolean; // Overall disabled state (e.g., loading, no API key)
}

const samplePrompts: string[] = [
  "A majestic lion wearing a crown, futuristic style, for a gaming logo",
  "A serene landscape with cherry blossom trees and a distant pagoda, watercolor style",
  "A sleek, minimalist app icon for a productivity tool, dark theme",
  "A whimsical illustration of a cat astronaut floating in space with planets",
  "Photo of a delicious-looking stack of pancakes with syrup and berries, top-down view",
  "A retro-futuristic cityscape at sunset, synthwave aesthetic",
  "An abstract geometric pattern with vibrant colors and sharp lines",
  "Pixel art icon of a treasure chest for a retro game",
  "Photorealistic image of a vintage camera on a wooden table, soft lighting",
  "A cartoonish monster peeking from behind a sign, playful and colorful",
  "Detailed sketch of a mythical phoenix rising from ashes, monochrome",
  "Banner image of a mountain range at dawn, epic fantasy style",
  "A flat design illustration of a coffee cup with steam, for a cafe logo",
  "3D render of a glowing crystal orb, magical and mysterious",
  "Icon for a weather app showing a sun partially covered by a cloud, modern UI style",
  "A pattern of autumn leaves, seamless and tileable, for a background",
  "Abstract representation of data flowing through a network, cyberpunk colors",
  "A cute chibi character dressed as a knight, holding a tiny sword",
  "Impressionist painting of a bustling Parisian street market",
  "Sci-fi concept art of a futuristic spaceship interior, control panel details",
  "Logo for a bakery: a rolling pin crossed with a whisk, elegant script font",
  "A dramatic portrait of a wolf howling at the moon, silhouetted",
  "Vector illustration of a friendly robot waving, clean and simple",
  "Macro photograph of a dewdrop on a spider web, intricate details",
  "A stained-glass window design featuring a celestial sun and moon",
  "Isometric view of a tiny, cozy isometric room with plants and a desk",
  "Pop art style portrait of a famous historical figure",
  "Surreal image of a floating island with a single tree, dreamlike atmosphere",
  "A logo for a music app: a stylized eighth note with sound waves",
  "Abstract fluid art with gold and teal mixing, high resolution texture",
  "Steampunk-inspired mechanical owl, cogs and gears visible",
  "A tranquil beach scene with palm trees and turquoise water, travel poster style",
  "Minimalist line art of a human face, continuous line",
  "A pattern of colorful tropical fish, underwater scene for a children's book",
  "Gothic architecture details, gargoyle on a cathedral, dark and moody",
  "Icon representing a shield, for security software, strong and modern",
  "A vibrant graffiti art piece on a brick wall, urban style",
  "Food photography: a perfectly grilled salmon fillet with lemon and herbs",
];

export const PromptForm: React.FC<PromptFormProps> = ({
  initialPrompt = '',
  initialAspectRatioKey,
  initialSizeKeys = [],
  aspectRatios,
  onGenerate,
  disabled = false,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatioKey, setAspectRatioKey] = useState(initialAspectRatioKey || aspectRatios[0]?.key);
  const [selectedSizeKeys, setSelectedSizeKeys] = useState<string[]>(initialSizeKeys);
  const [showPromptWarning, setShowPromptWarning] = useState(false);
  const [animateButtonShake, setAnimateButtonShake] = useState(false);

  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(samplePrompts[0]);
  const [isPlaceholderFading, setIsPlaceholderFading] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const placeholderIntervalRef = useRef<number | null>(null);
  const placeholderFadeTimeoutRef = useRef<number | null>(null);

  const currentAspectRatio = aspectRatios.find(ar => ar.key === aspectRatioKey) || aspectRatios[0];

  useEffect(() => {
    if (initialAspectRatioKey !== aspectRatioKey || (initialSizeKeys.length === 0 && currentAspectRatio)) {
         setSelectedSizeKeys(currentAspectRatio.defaultSizes.map(s => s.key));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatioKey, currentAspectRatio]); 

   useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialAspectRatioKey) setAspectRatioKey(initialAspectRatioKey);
    if (initialSizeKeys && initialSizeKeys.length > 0) setSelectedSizeKeys(initialSizeKeys);
  }, [initialPrompt, initialAspectRatioKey, initialSizeKeys]);

  useEffect(() => {
    if (prompt.trim() && showPromptWarning) {
      setShowPromptWarning(false);
    }
  }, [prompt, showPromptWarning]);

  // Dynamic placeholder cycling
  useEffect(() => {
    const cyclePlaceholder = () => {
      setIsPlaceholderFading(true); // Start fade-out

      if (placeholderFadeTimeoutRef.current) clearTimeout(placeholderFadeTimeoutRef.current);
      placeholderFadeTimeoutRef.current = window.setTimeout(() => {
        setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % samplePrompts.length);
        setIsPlaceholderFading(false); // Start fade-in with new text
      }, 300); // Corresponds to CSS transition duration
    };

    // Set initial placeholder without fade for the first time
    setAnimatedPlaceholder(samplePrompts[currentPlaceholderIndex]);

    if (placeholderIntervalRef.current) clearInterval(placeholderIntervalRef.current);
    placeholderIntervalRef.current = window.setInterval(cyclePlaceholder, 4300); // 5s visible + 0.3s fade

    return () => {
      if (placeholderIntervalRef.current) clearInterval(placeholderIntervalRef.current);
      if (placeholderFadeTimeoutRef.current) clearTimeout(placeholderFadeTimeoutRef.current);
    };
  }, []); // Run once on mount

  useEffect(() => {
    // Update animated placeholder when index changes (after fade-out)
    setAnimatedPlaceholder(samplePrompts[currentPlaceholderIndex]);
  }, [currentPlaceholderIndex]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; 

    if (!prompt.trim()) {
      setShowPromptWarning(true);
      setAnimateButtonShake(true);
      setTimeout(() => {
        setAnimateButtonShake(false);
      }, 400); 
      return;
    }
    onGenerate(prompt, aspectRatioKey, selectedSizeKeys);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && !prompt.trim() && isTextareaFocused && animatedPlaceholder) {
      e.preventDefault();
      setPrompt(animatedPlaceholder);
    }
  };

  const aspectRatioOptions = aspectRatios.map(ar => ({ value: ar.key, label: ar.label }));
  const isEffectivelyDisabledDueToNoPrompt = !prompt.trim() && !disabled;
  const showTabHint = isTextareaFocused && !prompt.trim() && animatedPlaceholder;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700">
      <div className="flex items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-100">Describe Your Vision...</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Prompt
          </label>
          <div className="relative"> {/* Parent for TAB hint positioning */}
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsTextareaFocused(true)}
              onBlur={() => setIsTextareaFocused(false)}
              onKeyDown={handleTextareaKeyDown}
              rows={4}
              placeholder={animatedPlaceholder}
              className={`
                prompt-textarea w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                text-gray-100 resize-none transition-colors duration-150 
                ${showPromptWarning ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus-subtle-pulse'}
                ${isPlaceholderFading ? 'placeholder-fading' : 'placeholder-visible'}
              `}
              disabled={disabled}
              aria-invalid={showPromptWarning}
              aria-describedby={showPromptWarning ? "prompt-warning" : undefined}
            />
            {showTabHint && (
              <span className={`tab-hint ${showTabHint ? 'tab-hint-visible' : ''}`}>
                TAB
              </span>
            )}
          </div>
          {showPromptWarning && (
            <div id="prompt-warning" className="mt-1.5 flex items-center text-xs text-red-400 animate-shake">
              <ExclamationTriangleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              Please enter a prompt to generate images.
            </div>
          )}
        </div>

        <Select
          label="Aspect Ratio / Format"
          options={aspectRatioOptions}
          value={aspectRatioKey}
          onChange={(e) => setAspectRatioKey(e.target.value)}
          disabled={disabled}
          containerClassName="focus-subtle-pulse rounded-md"
        />
        
        {currentAspectRatio && (
          <SizeSelector
            availableSizes={currentAspectRatio.defaultSizes}
            selectedSizeKeys={selectedSizeKeys}
            onChange={setSelectedSizeKeys}
            aspectRatioLabel={currentAspectRatio.label}
            disabled={disabled}
            context="promptForm"
          />
        )}

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className={`
            w-full group
            ${isEffectivelyDisabledDueToNoPrompt ? 
              'bg-purple-400 hover:bg-purple-400 opacity-60 cursor-not-allowed' : 
              ''
            }
            ${animateButtonShake ? 'animate-shake' : ''}
          `}
          disabled={disabled} 
        >
          <WandSparklesIcon className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Generate Images
        </Button>
      </form>
    </div>
  );
};
