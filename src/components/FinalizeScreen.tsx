
import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver'; 
import { ProcessedImageGroup, AspectRatioOption } from '../types';
import { Button } from './Button';
import { SizeSelector } from './SizeSelector';
import { Checkbox } from './Checkbox';
import { DownloadIcon, RefreshCwIcon, ArrowLeftIcon, ImagePlusIcon, Edit3Icon, PackageIcon, Loader2Icon } from './Icons'; 
import { getImageDimensions } from '../utils/imageUtils';

interface FinalizeScreenProps {
  processedImageGroups: ProcessedImageGroup[];
  aspectRatio: AspectRatioOption;
  selectedSizeKeys: string[];
  onSizeSelectionChange: (newSizeKeys: string[]) => void;
  onStartOver: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

interface HoverPreviewState {
  src: string;
  alt: string;
  top: number;
  left: number;
  visible: boolean;
}

export const FinalizeScreen: React.FC<FinalizeScreenProps> = ({
  processedImageGroups,
  aspectRatio,
  selectedSizeKeys,
  onSizeSelectionChange,
  onStartOver,
  onBack,
  isLoading = false,
}) => {
  const [fileNamePrefix, setFileNamePrefix] = useState<string>('generated_image');
  const [originalResolutions, setOriginalResolutions] = useState<Record<string, {width: number, height: number}>>({});
  const [isZipping, setIsZipping] = useState(false);
  const [includeOriginalsInZip, setIncludeOriginalsInZip] = useState<boolean>(true);
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchResolutions = async () => {
      const newResolutions: Record<string, {width: number, height: number}> = {};
      for (const group of processedImageGroups) {
        if (!originalResolutions[group.originalId] || originalResolutions[group.originalId].width === 0) {
          try {
            const dimensions = await getImageDimensions(group.originalBase64);
            newResolutions[group.originalId] = dimensions;
          } catch (error) {
            console.error(`Error getting dimensions for ${group.originalId}:`, error);
            newResolutions[group.originalId] = { width: 0, height: 0 }; 
          }
        }
      }
      if (Object.keys(newResolutions).length > 0) {
        setOriginalResolutions(prev => ({ ...prev, ...newResolutions }));
      }
    };

    if (processedImageGroups.length > 0) {
      fetchResolutions();
    }
  }, [processedImageGroups, originalResolutions]);

  const handleDownload = (dataUrl: string, filename: string) => {
    if (!dataUrl) {
        alert('Image data is not available for download.');
        return;
    }
    saveAs(dataUrl, filename);
  };

  const generateFilename = (baseName: string, width: number, height: number, original: boolean = false, index?: number) => {
    const prefix = baseName || 'image';
    const indexSuffix = index !== undefined ? `_${index + 1}` : '';
    if (original) {
      return `${prefix}${indexSuffix}_original.png`;
    }
    return `${prefix}${indexSuffix}_${width}x${height}.png`;
  };

  const handleDownloadAllIndividual = () => {
    processedImageGroups.forEach((group, groupIndex) => {
      handleDownload(
        `data:image/png;base64,${group.originalBase64}`, 
        generateFilename(fileNamePrefix, 0, 0, true, processedImageGroups.length > 1 ? groupIndex : undefined)
      );
      group.processed.forEach((imgVersion) => {
        if (imgVersion.dataUrl) {
          handleDownload(
            imgVersion.dataUrl, 
            generateFilename(fileNamePrefix, imgVersion.width, imgVersion.height, false, processedImageGroups.length > 1 ? groupIndex : undefined)
          );
        }
      });
    });
  };
  
  const handleDownloadAllZipped = async () => {
    if (isZipping) return;
    setIsZipping(true);
    const zip = new JSZip();
    
    for (let i = 0; i < processedImageGroups.length; i++) {
      const group = processedImageGroups[i];
      const groupFolder = processedImageGroups.length > 1 ? zip.folder(`${fileNamePrefix}_master_${i + 1}`) : zip;
      
      if (!groupFolder) { 
        console.error("Failed to create zip folder for group");
        continue;
      }

      if (includeOriginalsInZip) {
        const originalFilename = `original_master_${processedImageGroups.length > 1 ? i + 1 : ''}.png`; 
        groupFolder.file(originalFilename, group.originalBase64, { base64: true });
      }

      for (const imgVersion of group.processed) {
        if (imgVersion.dataUrl) {
          const versionFilename = `${imgVersion.width}x${imgVersion.height}.png`;
          const base64Data = imgVersion.dataUrl.substring(imgVersion.dataUrl.indexOf(',') + 1);
          groupFolder.file(versionFilename, base64Data, { base64: true });
        }
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${fileNamePrefix}_all_images.zip`);
    } catch (error) {
      console.error("Error generating zip file:", error);
      alert("Failed to generate zip file. Please try downloading individually.");
    } finally {
      setIsZipping(false);
    }
  };
  
  const handleMouseEnterPreview = (e: React.MouseEvent<HTMLDivElement>, src: string, alt: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Use clientX and clientY for cursor position
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    const previewElementWidth = previewRef.current?.offsetWidth || 170; // Estimate or get from ref after render
    const previewElementHeight = previewRef.current?.offsetHeight || 170; // Estimate or get from ref after render
    const offset = 15; // Space between cursor and preview

    let top = cursorY - previewElementHeight - offset;
    let left = cursorX - (previewElementWidth / 2);

    // Boundary checks
    if (top < 10) {
      top = cursorY + offset; // Show below if not enough space above
    }
    if (left < 10) {
      left = 10;
    }
    if (left + previewElementWidth > window.innerWidth - 10) {
      left = window.innerWidth - previewElementWidth - 10;
    }
    
    setHoverPreview({ src, alt, top, left, visible: true });
  };

  const handleMouseLeavePreview = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
         setHoverPreview(null);
    }, 200); // Small delay to prevent flickering
  };

  const nameExampleBase = fileNamePrefix || 'your_filename';
  const nameExampleIndexed = processedImageGroups.length > 1 ? `${nameExampleBase}_1` : nameExampleBase;
  const fileNamingExplanation = `Your files will adopt this naming scheme:
    "${nameExampleIndexed}_[width]x[height].png" (e.g., "${nameExampleIndexed}_256x256.png") and
    "${nameExampleIndexed}_original.png".
    ${processedImageGroups.length > 1 ? ` Subsequent master images will follow with an incremented index (e.g., "${nameExampleBase}_2_...").` : ''}`;


  if (processedImageGroups.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-400 mb-4">No images selected or processed for finalization.</p>
        <Button onClick={onBack} variant="secondary" leftIcon={<ArrowLeftIcon />} disabled={isLoading}>
          Back to Image Selection
        </Button>
      </div>
    );
  }
  
  const totalIndividualDownloadableFiles = processedImageGroups.reduce((sum, group) => {
    return sum + 1 /* original */ + group.processed.filter(p => p.dataUrl).length;
  }, 0);

  const totalZipDownloadableFiles = processedImageGroups.reduce((sum, group) => {
    let count = group.processed.filter(p => p.dataUrl).length;
    if (includeOriginalsInZip) {
      count += 1; // Add original if included
    }
    return sum + count;
  }, 0);


  return (
    <div className="max-w-6xl mx-auto">
      {hoverPreview?.visible && (
        <div 
          ref={previewRef}
          className="fixed p-2 bg-gray-800 border border-purple-500 rounded-lg shadow-2xl transition-opacity duration-200 ease-in-out"
          style={{ 
            top: `${hoverPreview.top}px`, 
            left: `${hoverPreview.left}px`, 
            zIndex: 100, 
            pointerEvents: 'none',
            maxWidth: '170px', // Ensure consistency with calculation
            maxHeight: '170px',
           }}
          onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
          onMouseLeave={handleMouseLeavePreview} // Allows moving mouse into preview
        >
          <img src={hoverPreview.src} alt={hoverPreview.alt} className="max-w-full max-h-full object-contain rounded" style={{maxWidth: '150px', maxHeight: '150px'}} />
          <p className="text-xs text-center text-gray-300 mt-1 truncate">{hoverPreview.alt}</p>
        </div>
      )}
      <div className="mb-8 p-4 bg-gray-800/50 rounded-lg shadow">
        <h2 className="text-3xl font-semibold mb-2 text-gray-100 flex items-center">
          <ImagePlusIcon className="w-8 h-8 mr-3 text-purple-400"/>
          Finalize & Download Your Assets
        </h2>
        <p className="text-sm text-gray-400">
          Format: {aspectRatio.label} | {processedImageGroups.length} Master Image(s) Selected
        </p>
      </div>

      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-3 text-gray-200 flex items-center">
          <Edit3Icon className="w-5 h-5 mr-2 text-purple-400" /> File Naming
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label htmlFor="fileNamePrefix" className="text-sm text-gray-300 whitespace-nowrap">Base Name:</label>
          <input
            type="text"
            id="fileNamePrefix"
            value={fileNamePrefix}
            onChange={(e) => setFileNamePrefix(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, '') || 'generated_image')}
            placeholder="e.g., my_project_logo"
            className="flex-grow p-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400 focus-subtle-pulse"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 whitespace-pre-line">{fileNamingExplanation}</p>
      </div>

      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <SizeSelector
          availableSizes={aspectRatio.defaultSizes}
          selectedSizeKeys={selectedSizeKeys}
          onChange={onSizeSelectionChange}
          aspectRatioLabel={aspectRatio.label}
          disabled={isLoading}
          context="finalizeScreen"
        />
      </div>

      {processedImageGroups.map((group, groupIndex) => {
        const masterFilename = generateFilename(fileNamePrefix, 0,0, true, processedImageGroups.length > 1 ? groupIndex : undefined);
        const resolution = originalResolutions[group.originalId];
        const numProcessedVersions = group.processed.filter(p => p.dataUrl).length;

        return (
          <div key={group.originalId} className="mb-12 p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700/50">
            <h3 className="text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-2">
              Master Image {processedImageGroups.length > 1 ? `#${groupIndex + 1}` : ''}
              <span className="text-xs ml-2 text-gray-400">(ID: ...{group.originalId.slice(-6)})</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h4 className="text-lg font-semibold mb-2 text-gray-200">Original Preview</h4>
                <div className="bg-gray-900/50 p-2 rounded-md border border-gray-600">
                  <img 
                    src={`data:image/png;base64,${group.originalBase64}`} 
                    alt={`Selected master ${groupIndex + 1}`}
                    className="w-full rounded aspect-square object-contain"
                  />
                </div>
                {resolution && resolution.width > 0 && (
                  <p className="text-sm text-gray-400 mt-2">Resolution: {resolution.width} x {resolution.height} px</p>
                )}
                <Button
                  onClick={() => handleDownload(`data:image/png;base64,${group.originalBase64}`, masterFilename)}
                  variant="secondary"
                  size="sm"
                  leftIcon={<DownloadIcon />}
                  className="w-full mt-3"
                  disabled={isLoading}
                >
                  Download Original
                </Button>
              </div>

              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold mb-2 text-gray-200">
                    Processed Versions ({numProcessedVersions} / {selectedSizeKeys.length})
                </h4>
                {selectedSizeKeys.length === 0 && <p className="text-yellow-400 text-sm">No sizes selected. Please select sizes above to generate versions.</p>}
                {numProcessedVersions === 0 && selectedSizeKeys.length > 0 && !isLoading && <p className="text-gray-400 text-sm">Processing versions based on selected sizes... (If this persists, there might be an issue)</p>}
                {isLoading && numProcessedVersions === 0 && selectedSizeKeys.length > 0 && <p className="text-gray-400 text-sm">Processing...</p>}
                
                {numProcessedVersions > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {group.processed.map((imgVersion) => {
                      if (!imgVersion.dataUrl) return null; 
                      const versionFilename = generateFilename(fileNamePrefix, imgVersion.width, imgVersion.height, false, processedImageGroups.length > 1 ? groupIndex : undefined);
                      return (
                        <div 
                          key={imgVersion.sizeKey} 
                          className="flex items-center justify-between p-3 bg-gray-700/60 rounded-md border border-gray-600 hover:border-purple-500 transition-colors"
                          onMouseEnter={(e) => handleMouseEnterPreview(e, imgVersion.dataUrl, `${imgVersion.sizeLabel} Preview`)}
                          onMouseLeave={handleMouseLeavePreview}
                        >
                          <div className="flex items-center space-x-3">
                            <img src={imgVersion.dataUrl} alt={imgVersion.sizeLabel} className="w-10 h-10 object-contain rounded bg-gray-600" />
                            <div>
                              <p className="text-gray-100 font-medium">{imgVersion.sizeLabel}</p>
                              <p className="text-xs text-gray-400">{imgVersion.width} x {imgVersion.height} px</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDownload(imgVersion.dataUrl, versionFilename)}
                            variant="ghost"
                            size="sm"
                            leftIcon={<DownloadIcon />}
                            disabled={!imgVersion.dataUrl || isLoading}
                          >
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : selectedSizeKeys.length > 0 && !isLoading && numProcessedVersions === 0 ? (
                   <p className="text-red-400">No versions were generated for the selected sizes. There might have been an issue during processing, or the source image could not be processed.</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* MOVED Download All Section HERE */}
      {(totalIndividualDownloadableFiles > 0 || totalZipDownloadableFiles > 0) && (
        <div className="my-8 p-6 bg-gray-800/60 rounded-lg shadow-lg border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                <Button 
                    onClick={handleDownloadAllIndividual} 
                    variant="primary" 
                    size="lg"
                    leftIcon={<DownloadIcon />}
                    disabled={isLoading || isZipping || totalIndividualDownloadableFiles === 0}
                >
                    Download All ({totalIndividualDownloadableFiles})
                </Button>
                <Button 
                    onClick={handleDownloadAllZipped} 
                    variant="primary" 
                    size="lg"
                    leftIcon={isZipping ? <Loader2Icon className="animate-spin" /> : <PackageIcon />}
                    disabled={isLoading || isZipping || totalZipDownloadableFiles === 0}
                >
                    {isZipping ? 'Zipping...' : `Download All as .zip (${totalZipDownloadableFiles})`}
                </Button>
            </div>
            <div className="flex justify-center mt-3">
                <Checkbox
                    id="includeOriginalsInZip"
                    label="Include original master image(s) in ZIP"
                    checked={includeOriginalsInZip}
                    onChange={(e) => setIncludeOriginalsInZip(e.target.checked)}
                    disabled={isLoading || isZipping}
                    labelClassName="text-sm text-gray-300"
                />
            </div>
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Button onClick={onBack} variant="secondary" size="lg" leftIcon={<ArrowLeftIcon />} disabled={isLoading || isZipping}>
          Back to Image Selection
        </Button>
        <Button onClick={onStartOver} variant="primary" size="lg" leftIcon={<RefreshCwIcon />} disabled={isLoading || isZipping}>
          Start Over (New Prompt)
        </Button>
      </div>
    </div>
  );
};
