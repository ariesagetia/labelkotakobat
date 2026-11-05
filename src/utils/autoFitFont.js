// Exact Arial Bold character units per em (1000 units per em)
const ARIAL_BOLD_UNITS = {
  ' ': 278, 'A': 722, 'B': 722, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778, 'H': 722,
  'I': 278, 'J': 556, 'K': 722, 'L': 611, 'M': 833, 'N': 722, 'O': 778, 'P': 667, 'Q': 778,
  'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944, 'X': 667, 'Y': 667, 'Z': 611,
  '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556, '8': 556,
  '9': 556, '.': 278, '-': 333, '/': 278, ',': 278, '%': 889, '(': 333, ')': 333, '+': 584,
  '@': 1015, '&': 667, ':': 278, ';': 278, '*': 389, '#': 556, '!': 333, '?': 556
};

/**
 * Measure pixel width of text rendered in Arial Bold uppercase,
 * taking into account the 1.07x synthetic bold weight factor in Chromium / browser rendering.
 * @param {string} text 
 * @param {number} sizePt font size in points
 * @returns {number} width in pixels (at standard 96 DPI)
 */
export function measureTextWidth(text, sizePt) {
  let units = 0;
  const str = String(text || '').toUpperCase();
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    units += (ARIAL_BOLD_UNITS[ch] !== undefined ? ARIAL_BOLD_UNITS[ch] : 650);
  }
  return (units / 1000) * sizePt * (96 / 72) * 1.07;
}

/**
 * Helper to simulate line breaking inside a given max pixel width.
 * @param {string} text 
 * @param {number} sz font size in pt
 * @param {number} maxW max width in px
 * @param {number} weightFactor multiplier for font weight (e.g. 1.0 for bold, 0.9 for semibold)
 * @returns {number} count of lines
 */
function countLines(text, sz, maxW, weightFactor = 1.0) {
  if (!text || !text.trim()) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  let lines = 0;
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (measureTextWidth(test, sz) * weightFactor <= maxW) {
      cur = test;
    } else {
      lines++;
      cur = w;
    }
  }
  if (cur) lines++;
  return lines;
}

/**
 * Safe maximum single word width inside a 65mm card (leaving >= 30px horizontal margin).
 * Ensures long words like DEXAMETHASONE, PREDNISOLONE, BETAMETHASONE, etc. NEVER get cut off.
 */
const MAX_SAFE_WORD_WIDTH = 160; // px

/**
 * Calculate the optimal font size for a medicine label item (Nama + Kemasan).
 * - Standard/normal medicines (~81% of data) KEEP FULL baseSize (17 pt Ekstra Besar) completely untouched.
 * - ONLY medicines that would wrap into 4+ lines (like PROCOLD FLU & BATUK (BIRU) STRIP)
 *   or have long words (like DEXAMETHASONE) are stepped down gracefully so:
 *   1. The item fits completely in the top half without colliding into the middle divider or borders.
 *   2. No word is ever split or cut off.
 * 
 * @param {string} nama 
 * @param {string} kemasan 
 * @param {number} baseSize default 17 pt
 * @returns {number} optimal font size in pt
 */
export function getOptimalItemFontSize(nama = '', kemasan = '', baseSize = 17) {
  const candidateSteps = [17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13, 12.5, 12, 11.5, 11, 10.5, 10, 9.5];
  const allWords = (nama + ' ' + (kemasan || '')).trim().split(/\s+/).filter(Boolean);

  for (const sz of candidateSteps) {
    if (sz > baseSize) continue;

    // 1. Verify that NO SINGLE WORD exceeds MAX_SAFE_WORD_WIDTH (160px)
    let hasWideWord = false;
    for (const w of allWords) {
      if (measureTextWidth(w, sz) > MAX_SAFE_WORD_WIDTH) {
        hasWideWord = true;
        break;
      }
    }
    if (hasWideWord) continue;

    // 2. Count lines at safe line wrap width (160px)
    const linesNama = countLines(nama, sz, 160, 1.0);
    const linesKemasan = countLines(kemasan, sz, 160, 1.0);
    const totalLines = linesNama + linesKemasan;

    const lineHeightPx = sz * (96 / 72) * 1.12;
    const totalHeight = totalLines * lineHeightPx;

    // Usable top half height is ~89px.
    // If 4 lines or more: totalHeight must be <= 62px so it NEVER touches the middle divider!
    if (totalLines >= 4 && totalHeight > 62) continue;
    // If 3 lines (e.g. CERINI / 10 MG / KAP): totalHeight 76px fits comfortably with >13px clearance
    if (totalLines === 3 && totalHeight > 78) continue;
    // If 1-2 lines: height is well within range
    if (totalHeight > 78) continue;

    return sz;
  }

  return 9.5;
}

/**
 * Calculate the optimal font size for the bottom half (Kandungan / Komposisi Obat).
 * - Standard kandungans (~62% of data) stay at the default baseSize (11 pt).
 * - Multi-component or long-word kandungans (like 'DEXAMETHASONE 0.5MG, DEXCHLORPHENIRAMINE 2MG')
 *   are stepped down (e.g. 9.5pt or 9pt) so:
 *   1. No word is EVER truncated with ellipsis (no '...').
 *   2. All text fits completely in the bottom half with ample padding from the divider and bottom border.
 * 
 * @param {string} kandungan 
 * @param {number} baseSize default 11 pt
 * @returns {number} optimal font size in pt
 */
export function getOptimalKandunganFontSize(kandungan = '', baseSize = 11) {
  if (!kandungan || !kandungan.trim()) return baseSize;
  const text = kandungan.trim();
  const candidateSteps = [11, 10.5, 10, 9.5, 9, 8.5, 8];
  const words = text.split(/\s+/).filter(Boolean);
  const MAX_SAFE_KANDUNGAN_WORD_WIDTH = 150; // px (leaving >= 35px side margin)

  for (const sz of candidateSteps) {
    if (sz > baseSize) continue;

    // 1. Longest single word check (e.g. DEXCHLORPHENIRAMINE)
    let hasWideWord = false;
    for (const w of words) {
      const cleanW = w.replace(/[,.;:()]/g, '');
      if (measureTextWidth(cleanW, sz) * 0.9 > MAX_SAFE_KANDUNGAN_WORD_WIDTH) {
        hasWideWord = true;
        break;
      }
    }
    if (hasWideWord) continue;

    // 2. Wrap lines check at safe width (180px)
    const lines = countLines(text, sz, 180, 0.9);
    const lineHeightPx = sz * (96 / 72) * 1.14;
    const totalHeight = lines * lineHeightPx;

    // Usable height inside bottom half is ~89px.
    // Total text height must not exceed 58px to leave generous buffer from divider & bottom
    if (totalHeight > 58) continue;

    // If 4 lines, totalHeight must be <= 48px
    if (lines > 3 && totalHeight > 48) continue;
    if (lines > 4) continue;

    return sz;
  }

  return 8;
}
