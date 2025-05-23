
// Function to resize an image (base64) using Canvas
export const resizeImage = (base64Str: string, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str.startsWith('data:image') ? base64Str : `data:image/png;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth; 
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context for resizing'));
      }
      // Draw image, stretching if necessary to fit target dimensions
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png')); // Output as PNG
    };
    img.onerror = (err) => {
      console.error("Image load error for resizing:", err);
      reject(new Error('Failed to load image for resizing'));
    };
  });
};

// Function to crop an image to a specific aspect ratio (e.g., 16:9) from a source (e.g., 1:1)
// It performs a center crop.
export const cropImageToAspectRatio = (
  base64Str: string,
  targetWidthRatio: number,
  targetHeightRatio: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str.startsWith('data:image') ? base64Str : `data:image/png;base64,${base64Str}`;
    img.onload = () => {
      const sourceWidth = img.width;
      const sourceHeight = img.height;
      const sourceAspectRatio = sourceWidth / sourceHeight;
      const targetAspectRatio = targetWidthRatio / targetHeightRatio;

      let cropWidth = sourceWidth;
      let cropHeight = sourceHeight;
      let cropX = 0;
      let cropY = 0;

      if (sourceAspectRatio > targetAspectRatio) {
        // Source image is wider than target aspect ratio (need to crop sides)
        cropWidth = sourceHeight * targetAspectRatio;
        cropX = (sourceWidth - cropWidth) / 2;
      } else if (sourceAspectRatio < targetAspectRatio) {
        // Source image is taller than target aspect ratio (need to crop top/bottom)
        cropHeight = sourceWidth / targetAspectRatio;
        cropY = (sourceHeight - cropHeight) / 2;
      }
      // If aspect ratios are the same, no crop needed

      const canvas = document.createElement('canvas');
      // The cropped image should be at the native resolution of the cropped area
      canvas.width = Math.max(1, Math.round(cropWidth)); 
      canvas.height = Math.max(1, Math.round(cropHeight));
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context for cropping'));
      }

      ctx.drawImage(
        img,
        cropX,        
        cropY,        
        cropWidth,    
        cropHeight,   
        0,            
        0,            
        canvas.width, 
        canvas.height 
      );
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => {
      console.error("Image load error for cropping:", err);
      reject(new Error('Failed to load image for cropping'));
    };
  });
};

// Function to get dimensions of a base64 image
export const getImageDimensions = (base64Str: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str.startsWith('data:image') ? base64Str : `data:image/png;base64,${base64Str}`;
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      console.error("Image load error for getting dimensions:", err);
      reject(new Error('Failed to load image for getting dimensions'));
    };
  });
};
