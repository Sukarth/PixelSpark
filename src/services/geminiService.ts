

import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";
// Removed: import { GeneratedImageData } from '../types'; as it's not directly used here.

// API_KEY and global 'ai' instance are removed. 
// The client will be initialized per call with the user's key.

const DEFAULT_IMAGE_MODEL = 'imagen-3.0-generate-002'; // Default if modelName is not properly passed

export const generateImagesFromPrompt = async (
  prompt: string, 
  apiKey: string, // User-provided API Key
  modelName: string, // User-selected model
  numberOfImages: number = 4
): Promise<string[]> => {
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API Key is missing. Please provide a valid API Key.");
  }
  if (!modelName || modelName.trim() === "") {
    console.warn("Model name is missing, defaulting to imagen-3.0-generate-002");
    modelName = DEFAULT_IMAGE_MODEL;
  }

  let aiInstance: GoogleGenAI;
  try {
    // fix: Initialize GoogleGenAI with named apiKey parameter
    aiInstance = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI with the provided API key:", e);
    throw new Error("Failed to initialize AI client. The API Key might be malformed or invalid.");
  }

  try {
    // fix: Changed GenerateImageResponse to GenerateImagesResponse
    const response: GenerateImagesResponse = await aiInstance.models.generateImages({
      model: modelName,
      prompt: prompt,
      config: { 
        numberOfImages: Math.min(Math.max(numberOfImages,1), 4), // Clamp between 1 and 4
        outputMimeType: 'image/png' 
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages
        .map(img => img.image?.imageBytes)
        .filter((bytes): bytes is string => typeof bytes === 'string'); // Only keep defined strings
    } else {
      console.warn("Gemini API returned no images for prompt:", prompt, "Response:", response);
      // Potentially inspect response.candidates[0].finishReason or safetyRatings
      let message = "The AI could not generate images for this prompt. It might be too restrictive or violate content policies.";
      // if (response?.candidates?.[0]?.finishReason === "SAFETY") {
      //    message = "Image generation failed due to safety restrictions for the given prompt.";
      // } // This structure depends on the actual API response for safety blocks with imagen
      throw new Error(message);
    }
  } catch (error) {
    console.error(`Error calling Gemini API (model: ${modelName}, generateImages):`, error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes("api key not valid") || 
            error.message.toLowerCase().includes("permission denied") ||
            error.message.toLowerCase().includes("invalid api key")) {
            throw new Error("Invalid API Key. Please check your API Key in Settings.");
        }
        if (error.message.toLowerCase().includes("quota")) {
            throw new Error("API quota exceeded. Please check your Google Cloud Console or API Key usage.");
        }
         throw new Error(`Failed to generate images: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating images.');
  }
};