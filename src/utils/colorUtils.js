/**
 * Color utility functions for Apotek Label Master
 * Implements WCAG 2.1 relative luminance and contrast calculations
 */

// Convert hex to {r, g, b}
export function hexToRgb(hex) {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Convert {r, g, b} to hex
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Calculate relative luminance according to WCAG 2.1
export function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Auto-determine optimal text color (white or dark) for >= 4.5:1 contrast
export function getOptimalTextColor(bgColorHex) {
  try {
    const rgb = hexToRgb(bgColorHex);
    const lum = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
    // If background luminance is greater than 0.35, use dark text; else use white text
    return lum > 0.35 ? '#111827' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}

// Generate a slightly darker border color for the card
export function getDarkerColor(hex, factor = 0.8) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * factor, g * factor, b * factor);
  } catch {
    return '#374151';
  }
}

// Popular pharmacy / medical preset color swatches
export const PHARMACY_PALETTES = [
  { name: 'Ungu Lampiran 1', hex: '#6B2D82' },
  { name: 'Merah Antibiotik', hex: '#C1121F' },
  { name: 'Biru Tua Saraf', hex: '#1D3557' },
  { name: 'Hijau Generik', hex: '#2E7D32' },
  { name: 'Magenta Hormon', hex: '#C2185B' },
  { name: 'Oranye Nyeri', hex: '#E65100' },
  { name: 'Kuning Multivitamin', hex: '#F59E0B' },
  { name: 'Teal Obat Bebas', hex: '#00897B' },
  { name: 'Coklat Pencernaan', hex: '#5D4037' },
  { name: 'Biru Pernafasan', hex: '#0288D1' },
  { name: 'Abu Salep', hex: '#455A64' },
  { name: 'Indigo Ungu', hex: '#4F46E5' },
  { name: 'Cyan Suppositoria', hex: '#00838F' },
  { name: 'Hijau Daun TT', hex: '#558B2F' },
  { name: 'Emerald TM', hex: '#00695C' },
  { name: 'Pink Lembut', hex: '#DB2777' },
  { name: 'Navy Gelap', hex: '#0F172A' },
  { name: 'Abu Netral', hex: '#4B5563' }
];

export const THEME_PRESETS = {
  lampiran1: {
    name: 'Standar Lampiran 1 (Ungu Apotek)',
    colors: {
      "ALERGI": { bg: "#6B2D82", text: "#ffffff", border: "#521d66" },
      "ANTIBIOTIK": { bg: "#C1121F", text: "#ffffff", border: "#960d17" },
      "DEGENERATIF": { bg: "#1D3557", text: "#ffffff", border: "#13233a" },
      "GENERIK": { bg: "#2E7D32", text: "#ffffff", border: "#1f5622" },
      "HORMON": { bg: "#C2185B", text: "#ffffff", border: "#880e4f" },
      "MULTIVITAMIN": { bg: "#E65100", text: "#ffffff", border: "#b23c00" },
      "NYERI": { bg: "#D84315", text: "#ffffff", border: "#9f2f0c" },
      "OBAT BEBAS": { bg: "#00897B", text: "#ffffff", border: "#005b52" },
      "PENCERNAAN": { bg: "#5D4037", text: "#ffffff", border: "#3e2723" },
      "PERNAFASAN": { bg: "#0277BD", text: "#ffffff", border: "#014c77" },
      "SALEP": { bg: "#455A64", text: "#ffffff", border: "#263238" },
      "SARAF": { bg: "#4527A0", text: "#ffffff", border: "#281364" },
      "SUPPOSITORIA": { bg: "#00838F", text: "#ffffff", border: "#00565f" },
      "TM": { bg: "#00695C", text: "#ffffff", border: "#00433a" },
      "TT": { bg: "#558B2F", text: "#ffffff", border: "#33691e" },
      "T": { bg: "#795548", text: "#ffffff", border: "#4e342e" },
      "TANPA": { bg: "#374151", text: "#ffffff", border: "#1f2937" }
    }
  },
  pastel: {
    name: 'Pastel Modern (Lembut & Bersih)',
    colors: {
      "ALERGI": { bg: "#E9D5FF", text: "#581C87", border: "#C084FC" },
      "ANTIBIOTIK": { bg: "#FEE2E2", text: "#991B1B", border: "#F87171" },
      "DEGENERATIF": { bg: "#E0E7FF", text: "#3730A3", border: "#818CF8" },
      "GENERIK": { bg: "#DCFCE7", text: "#166534", border: "#4ADE80" },
      "HORMON": { bg: "#FCE7F3", text: "#9D174D", border: "#F472B6" },
      "MULTIVITAMIN": { bg: "#FEF3C7", text: "#92400E", border: "#FBBF24" },
      "NYERI": { bg: "#FFEDD5", text: "#9A3412", border: "#FB923C" },
      "OBAT BEBAS": { bg: "#CCFBF1", text: "#115E59", border: "#2DD4BF" },
      "PENCERNAAN": { bg: "#F5D0FE", text: "#86198F", border: "#E879F9" },
      "PERNAFASAN": { bg: "#E0F2FE", text: "#075985", border: "#38BDF8" },
      "SALEP": { bg: "#F1F5F9", text: "#334155", border: "#94A3B8" },
      "SARAF": { bg: "#EDE9FE", text: "#5B21B6", border: "#A78BFA" },
      "SUPPOSITORIA": { bg: "#CFFAFE", text: "#155E75", border: "#22D3EE" },
      "TM": { bg: "#D1FAE5", text: "#065F46", border: "#34D399" },
      "TT": { bg: "#ECFCCB", text: "#3F6212", border: "#A3E635" },
      "T": { bg: "#E2E8F0", text: "#1E293B", border: "#94A3B8" },
      "TANPA": { bg: "#E5E7EB", text: "#1F2937", border: "#9CA3AF" }
    }
  },
  boldVibrant: {
    name: 'Kontras Tinggi / Neon',
    colors: {
      "ALERGI": { bg: "#7E22CE", text: "#ffffff", border: "#581C87" },
      "ANTIBIOTIK": { bg: "#DC2626", text: "#ffffff", border: "#991B1B" },
      "DEGENERATIF": { bg: "#2563EB", text: "#ffffff", border: "#1D4ED8" },
      "GENERIK": { bg: "#16A34A", text: "#ffffff", border: "#15803D" },
      "HORMON": { bg: "#DB2777", text: "#ffffff", border: "#BE185D" },
      "MULTIVITAMIN": { bg: "#D97706", text: "#ffffff", border: "#B45309" },
      "NYERI": { bg: "#EA580C", text: "#ffffff", border: "#C2410C" },
      "OBAT BEBAS": { bg: "#0D9488", text: "#ffffff", border: "#0F766E" },
      "PENCERNAAN": { bg: "#78350F", text: "#ffffff", border: "#451A03" },
      "PERNAFASAN": { bg: "#0284C7", text: "#ffffff", border: "#0369A1" },
      "SALEP": { bg: "#475569", text: "#ffffff", border: "#334155" },
      "SARAF": { bg: "#4338CA", text: "#ffffff", border: "#3730A3" },
      "SUPPOSITORIA": { bg: "#0891B2", text: "#ffffff", border: "#0E7490" },
      "TM": { bg: "#059669", text: "#ffffff", border: "#047857" },
      "TT": { bg: "#65A30D", text: "#ffffff", border: "#4D7C0F" },
      "T": { bg: "#52525B", text: "#ffffff", border: "#3F3F46" },
      "TANPA": { bg: "#1F2937", text: "#ffffff", border: "#111827" }
    }
  }
};
