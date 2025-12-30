import { toPng } from 'html-to-image';

/**
 * Export Stories Module
 * Generates PNG images in 9:16 format (1080x1920) for Instagram Stories
 */

export interface ExportOptions {
  format: '9:16';
  quality: number; // 0.8 - 1.0
  watermark: boolean;
  watermarkText: string;
}

const DEFAULT_OPTIONS: ExportOptions = {
  format: '9:16',
  quality: 0.95,
  watermark: true,
  watermarkText: 'Généré par Stravap.app',
};

/**
 * Export a slide element to PNG image
 */
export async function exportSlideToImage(
  slideElement: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<Blob> {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  // Instagram Stories dimensions: 9:16 aspect ratio
  const width = 1080;
  const height = 1920;

  try {
    console.log('📸 Starting image export...', { width, height, quality: finalOptions.quality });

    const dataUrl = await toPng(slideElement, {
      width,
      height,
      quality: finalOptions.quality,
      pixelRatio: 2, // High DPI for better quality
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${width}px`,
        height: `${height}px`,
      },
      // Filter out interactive elements
      filter: (node) => {
        // Remove navigation buttons, tooltips, etc.
        if (node.classList) {
          return !node.classList.contains('no-export');
        }
        return true;
      },
    });

    console.log('✅ Image rendered to data URL');

    // Add watermark if enabled
    if (finalOptions.watermark) {
      const canvas = await addWatermark(
        dataUrl,
        finalOptions.watermarkText,
        width,
        height
      );
      console.log('✅ Watermark added');

      return await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('✅ Blob created', { size: blob.size });
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          finalOptions.quality
        );
      });
    }

    // Convert dataUrl to Blob without watermark
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    console.log('✅ Export complete', { size: blob.size });
    return blob;
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw new Error(`Échec de l'export de l'image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Add watermark to the exported image
 */
async function addWatermark(
  dataUrl: string,
  text: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw original image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = dataUrl;
  });

  ctx.drawImage(img, 0, 0, width, height);

  // Add watermark at bottom center
  ctx.save();

  // Semi-transparent background for watermark
  const textMetrics = ctx.measureText(text);
  const padding = 20;
  const textWidth = textMetrics.width;
  const textHeight = 30;
  const bgX = (width - textWidth) / 2 - padding;
  const bgY = height - 80;
  const bgWidth = textWidth + padding * 2;
  const bgHeight = textHeight + padding;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

  // Watermark text
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height - 60);

  ctx.restore();

  return canvas;
}

/**
 * Share image to social platforms using native share API
 * Falls back to download if share API not available
 */
export async function shareToSocial(blob: Blob, title: string): Promise<boolean> {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `strava-wrapped-${timestamp}.png`;

  const file = new File([blob], filename, {
    type: 'image/png',
  });

  console.log('📤 Attempting to share...', { filename, size: file.size });

  // Try native share API (works on mobile)
  if (navigator.share) {
    try {
      // Check if files can be shared
      const canShare = navigator.canShare?.({ files: [file] }) ?? false;

      if (canShare) {
        await navigator.share({
          title,
          text: 'Mon Strava Wrapped 2025 🔥',
          files: [file],
        });
        console.log('✅ Shared via native API');
        return true;
      } else {
        console.log('⚠️ Native share available but cannot share files');
      }
    } catch (error) {
      // User cancelled or share failed
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('ℹ️ Share cancelled by user');
        return false;
      }
      console.warn('⚠️ Native share failed:', error);
      // Fall through to download
    }
  }

  // Fallback: Download file
  console.log('💾 Falling back to download');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);

  console.log('✅ Download initiated');
  return true;
}

/**
 * Check if native share is available
 */
export function isShareAvailable(): boolean {
  return typeof navigator.share === 'function';
}

/**
 * Get recommended export quality based on device
 */
export function getRecommendedQuality(): number {
  // Lower quality on mobile to reduce memory usage
  if (typeof window !== 'undefined') {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isMobile ? 0.9 : 0.95;
  }
  return 0.95;
}
