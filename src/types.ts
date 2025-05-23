
export enum AppScreen {
  PROMPT_INPUT = 'PROMPT_INPUT',
  IMAGE_SELECTION = 'IMAGE_SELECTION',
  FINALIZE_DOWNLOAD = 'FINALIZE_DOWNLOAD',
}

export type SizeOption = {
  key: string; // e.g., 'icon_256', 'banner_1280_720'
  label: string; // e.g., '256x256 px', '1280x720 px'
  width: number;
  height: number;
};

export type AspectRatioOption = {
  key: string; // e.g., 'SQUARE', 'BANNER_16_9'
  label: string; // e.g., 'Icon (1:1)', 'Banner (16:9)'
  widthRatio: number;
  heightRatio: number;
  defaultSizes: SizeOption[];
};

export type GeneratedImageData = {
  id: string; // unique id for key prop
  base64: string; // base64 string of the image
};

export type ProcessedImageGroup = {
  originalId: string;
  originalBase64: string; 
  processed: Array<{
    sizeKey: string;
    sizeLabel: string;
    width: number;
    height: number;
    dataUrl: string; 
  }>;
};
