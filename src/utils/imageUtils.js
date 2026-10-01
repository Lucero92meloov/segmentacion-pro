import { hexToRgb, getDerivedColors } from './themeUtils';

/**
 * Load an image file into a HTMLImageElement and resize down to max 2000px on long side.
 * Returns a data URL or HTMLCanvasElement.
 */
export function processUploadedImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('La imagen proporcionada no es válida.'));
      img.onload = () => {
        const MAX_SIZE = 2000;
        let { width, height } = img;
        
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        
        // Determine aspect ratio type
        // height >= width -> vertical/square
        const isVertical = height >= width;
        
        resolve({
          dataUrl,
          originalWidth: width,
          originalHeight: height,
          isVertical,
          aspectRatio: width / height
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Apply duotone filter to image canvas context.
 */
export function applyDuotoneToCanvas(canvas, imgElement, themeColors) {
  if (!canvas || !imgElement || !imgElement.complete) return;

  const width = imgElement.naturalWidth || imgElement.width || canvas.width;
  const height = imgElement.naturalHeight || imgElement.height || canvas.height;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Calculate grayscale & find min / max for auto-contrast
  let minLum = 255;
  let maxLum = 0;
  const lums = new Float32Array(data.length / 4);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    lums[j] = lum;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const range = maxLum - minLum || 1;
  const derived = getDerivedColors(themeColors);
  
  const cDark = hexToRgb(derived.duotoneDark);
  const cMid = hexToRgb(derived.duotoneMid);
  const cLight = hexToRgb(derived.duotoneLight);

  // Helper for 3-stop interpolation
  function interpolate3Stops(t) {
    // t ranges from 0 to 1
    if (t <= 0.5) {
      // 0 -> cDark, 0.5 -> cMid
      const localT = t / 0.5;
      return {
        r: cDark.r + (cMid.r - cDark.r) * localT,
        g: cDark.g + (cMid.g - cDark.g) * localT,
        b: cDark.b + (cMid.b - cDark.b) * localT
      };
    } else {
      // 0.5 -> cMid, 1.0 -> cLight
      const localT = (t - 0.5) / 0.5;
      return {
        r: cMid.r + (cLight.r - cMid.r) * localT,
        g: cMid.g + (cLight.g - cMid.g) * localT,
        b: cMid.b + (cLight.b - cMid.b) * localT
      };
    }
  }

  // 2. Apply autocontrast, gamma 0.7 correction, and tone mapping
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const lum = lums[j];
    // Autocontrast normalization [0, 1]
    const norm = (lum - minLum) / range;
    // Gamma correction 0.7 (lightens shadows)
    const gammaLum = Math.pow(norm, 0.7);

    const mapped = interpolate3Stops(gammaLum);

    data[i] = Math.round(mapped.r);
    data[i + 1] = Math.round(mapped.g);
    data[i + 2] = Math.round(mapped.b);
    // alpha data[i+3] unchanged
  }

  ctx.putImageData(imgData, 0, 0);
}
