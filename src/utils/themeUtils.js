/**
 * Convert a hex color string (#RRGGBB or #RGB) to an {r, g, b} object.
 */
export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Convert {r, g, b} to hex string.
 */
export function rgbToHex(r, g, b) {
  const toHex = (c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Mix color1 and color2 by a given weight (0 to 1).
 * Weight = 1 means 100% color1, Weight = 0 means 100% color2.
 */
export function mixColors(color1Hex, color2Hex, weight = 0.5) {
  const c1 = hexToRgb(color1Hex);
  const c2 = hexToRgb(color2Hex);
  const w = Math.max(0, Math.min(1, weight));
  
  const r = c1.r * w + c2.r * (1 - w);
  const g = c1.g * w + c2.g * (1 - w);
  const b = c1.b * w + c2.b * (1 - w);

  return rgbToHex(r, g, b);
}

/**
 * Calculate WCAG relative luminance for a color.
 */
export function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

/**
 * Verify contrast quality for text on a background color.
 */
export function checkThemeContrast(textColor, bgColor) {
  const ratio = getContrastRatio(textColor, bgColor);
  const isReadable = ratio >= 3.5;
  return {
    ratio: Number(ratio.toFixed(2)),
    isReadable,
    warning: !isReadable ? `El contraste (${ratio.toFixed(1)}:1) es bajo. El texto podría ser difícil de leer.` : null
  };
}

/**
 * Compute derived colors from the 4 user colors (primary, secondary, bg, text).
 */
export function getDerivedColors(colors) {
  const { primary, secondary, bg, text } = colors;

  return {
    primary,
    secondary,
    bg,
    text,
    // Soft card backgrounds (primary tinted)
    cardBgPrimary: mixColors(primary, bg, 0.06),
    cardBorderPrimary: mixColors(primary, bg, 0.30),
    
    // Soft card backgrounds (secondary tinted)
    cardBgSecondary: mixColors(secondary, bg, 0.07),
    cardBorderSecondary: mixColors(secondary, bg, 0.30),
    
    // Chips & badges
    chipBg: mixColors(primary, bg, 0.10),
    chipBorder: mixColors(primary, bg, 0.25),
    
    // Dimmed / Soft text
    textMuted: mixColors(text, bg, 0.60),
    textSubtle: mixColors(text, bg, 0.38),

    // Duotone stops
    duotoneDark: mixColors(text, primary, 0.70), // Shadows
    duotoneMid: primary,                         // Midtones
    duotoneLight: mixColors(primary, '#FFFFFF', 0.15) // Highlights
  };
}
