
import { AspectRatioOption, SizeOption } from './types';

export const DEFAULT_SQUARE_SIZES: SizeOption[] = [
  { key: 'icon_256', label: '256x256 px', width: 256, height: 256 },
  { key: 'icon_128', label: '128x128 px', width: 128, height: 128 },
  { key: 'icon_96', label: '96x96 px', width: 96, height: 96 },
  { key: 'icon_64', label: '64x64 px', width: 64, height: 64 },
  { key: 'icon_48', label: '48x48 px', width: 48, height: 48 },
  { key: 'icon_32', label: '32x32 px', width: 32, height: 32 },
  { key: 'icon_24', label: '24x24 px', width: 24, height: 24 },
  { key: 'icon_16', label: '16x16 px', width: 16, height: 16 },
];

export const DEFAULT_BANNER_16_9_SIZES: SizeOption[] = [
  { key: 'banner_1920_1080', label: '1920x1080 px (Full HD)', width: 1920, height: 1080 },
  { key: 'banner_1280_720', label: '1280x720 px (HD)', width: 1280, height: 720 },
  { key: 'banner_960_540', label: '960x540 px', width: 960, height: 540},
  { key: 'banner_640_360', label: '640x360 px', width: 640, height: 360 },
];

export const DEFAULT_PORTRAIT_4_5_SIZES: SizeOption[] = [
  { key: 'portrait_1080_1350', label: '1080x1350 px (Social)', width: 1080, height: 1350 },
  { key: 'portrait_800_1000', label: '800x1000 px', width: 800, height: 1000 },
  { key: 'portrait_400_500', label: '400x500 px', width: 400, height: 500 },
];

export const DEFAULT_COVER_3_1_SIZES: SizeOption[] = [
    { key: 'cover_1500_500', label: '1500x500 px (Profile Cover)', width: 1500, height: 500 },
    { key: 'cover_1200_400', label: '1200x400 px', width: 1200, height: 400 },
    { key: 'cover_900_300', label: '900x300 px', width: 900, height: 300 },
];


export const ASPECT_RATIOS: AspectRatioOption[] = [
  { 
    key: 'SQUARE', 
    label: 'Square (1:1)', 
    widthRatio: 1, 
    heightRatio: 1, 
    defaultSizes: DEFAULT_SQUARE_SIZES 
  },
  { 
    key: 'BANNER_16_9', 
    label: 'Banner (16:9)', 
    widthRatio: 16, 
    heightRatio: 9, 
    defaultSizes: DEFAULT_BANNER_16_9_SIZES
  },
  { 
    key: 'PORTRAIT_4_5', 
    label: 'Portrait (4:5)', 
    widthRatio: 4, 
    heightRatio: 5, 
    defaultSizes: DEFAULT_PORTRAIT_4_5_SIZES
  },
  {
    key: 'COVER_3_1',
    label: 'Cover (3:1)',
    widthRatio: 3,
    heightRatio: 1,
    defaultSizes: DEFAULT_COVER_3_1_SIZES
  }
];

export const AVAILABLE_IMAGE_MODELS = [
  { key: 'imagen-3.0-generate-002', label: 'Imagen 3.0 (Latest & Recommended)' },
  // Add other compatible Imagen models here if they become available or relevant
  // For example: { key: 'some-other-imagen-model', label: 'Imagen X.Y (Experimental)' },
];

export const LOCAL_STORAGE_API_KEY = 'pixelSparkUserApiKey';
export const LOCAL_STORAGE_MODEL_KEY = 'pixelSparkSelectedModel';
