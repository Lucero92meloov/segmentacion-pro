import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Wait until document fonts and images inside element are fully loaded.
 */
export async function prepareElementForExport(element) {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  
  const imgs = element.querySelectorAll('img');
  const promises = Array.from(imgs).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  
  await Promise.all(promises);
}

/**
 * Format filename: segmentacion-<title>.<ext>
 */
export function generateFilename(title, extension) {
  const cleanTitle = (title || 'lanzamiento')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `segmentacion-${cleanTitle || 'pro'}.${extension}`;
}

/**
 * Share file using Web Share API or download fallback.
 */
export async function shareOrDownloadFile(blob, filename, mimeType) {
  const file = new File([blob], filename, { type: mimeType });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Segmentación Pro Reporte',
        text: 'Informe visual de segmentación para lanzamiento musical.'
      });
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share failed, falling back to download:', err);
      } else {
        return; // User cancelled share
      }
    }
  }

  // Fallback download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Export report as PNG.
 */
export async function exportAsPng(element, title, scale = 2, bgColor = '#FFFFFF') {
  await prepareElementForExport(element);
  
  const dataUrl = await toPng(element, {
    pixelRatio: scale,
    backgroundColor: bgColor,
    style: {
      transform: 'none',
      transformOrigin: 'none'
    }
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const filename = generateFilename(title, 'png');
  await shareOrDownloadFile(blob, filename, 'image/png');
}

/**
 * Export report as JPG.
 */
export async function exportAsJpg(element, title, quality = 0.92, scale = 2, bgColor = '#FFFFFF') {
  await prepareElementForExport(element);

  const dataUrl = await toJpeg(element, {
    pixelRatio: scale,
    quality: quality,
    backgroundColor: bgColor,
    style: {
      transform: 'none',
      transformOrigin: 'none'
    }
  });

  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const filename = generateFilename(title, 'jpg');
  await shareOrDownloadFile(blob, filename, 'image/jpeg');
}

/**
 * Export report as single page PDF matching exact report dimensions.
 */
export async function exportAsPdf(element, title, bgColor = '#FFFFFF') {
  await prepareElementForExport(element);

  // Render high quality image at 2x ratio for crisp PDF text
  const dataUrl = await toJpeg(element, {
    pixelRatio: 2,
    quality: 0.95,
    backgroundColor: bgColor,
    style: {
      transform: 'none',
      transformOrigin: 'none'
    }
  });

  // Get true unscaled bounding box dimensions
  const rect = element.getBoundingClientRect();
  const unscaledWidth = 1600; // Fixed internal report poster width
  const scaleRatio = unscaledWidth / (rect.width || 1600);
  const width = 1600;
  const height = Math.round(rect.height * scaleRatio);

  const pdf = new jsPDF({
    orientation: height > width ? 'p' : 'l',
    unit: 'px',
    format: [width, height],
    compress: true
  });

  pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);

  const pdfBlob = pdf.output('blob');
  const filename = generateFilename(title, 'pdf');
  await shareOrDownloadFile(pdfBlob, filename, 'application/pdf');
}
