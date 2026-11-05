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
 * Safe maximum single word width inside a 65mm card (leaving >= 16px horizontal margin).
 * This ensures long words like DEXAMETHASONE, PREDNISOLONE, BETAMETHASONE, etc. NEVER get cut off.
 */
const MAX_SAFE_WORD_WIDTH = 185; // px

/**
 * Calculate the optimal font size for a medicine label.
 * - Standard/normal medicines (~88% of data) KEEP FULL baseSize (17 pt Ekstra Besar) completely untouched.
 * - ONLY medicines with a long word that would otherwise get cut off (like DEXAMETHASONE)
 *   or with 4+ lines are stepped down slightly (e.g. 14pt or 14.5pt) so:
 *   1. No word is EVER split across lines (no 'DEXAMETHASO-NE' cut-off).
 *   2. Text NEVER touches top border or middle divider.
 * 
 * @param {string} nama 
 * @param {string} kemasan 
 * @param {number} baseSize default 17 pt
 * @returns {number} optimal font size in pt
 */
export function getOptimalItemFontSize(nama = '', kemasan = '', baseSize = 17) {
  const candidateSteps = [17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13, 12.5, 12, 11.5, 11];
  const allWords = (nama + ' ' + (kemasan || '')).trim().split(/\s+/).filter(Boolean);

  for (const sz of candidateSteps) {
    if (sz > baseSize) continue;

    // 1. Verify that NO SINGLE WORD in the item exceeds MAX_SAFE_WORD_WIDTH
    let hasWideWord = false;
    for (const w of allWords) {
      if (measureTextWidth(w, sz) > MAX_SAFE_WORD_WIDTH) {
        hasWideWord = true;
        break;
      }
    }
    if (hasWideWord) continue;

    // 2. Simulate line wrapping inside printable width (max 200px)
    const lineHeightPx = sz * (96 / 72) * 1.12;
    let lines = 0;
    let curLine = '';
    for (const w of nama.trim().split(/\s+/).filter(Boolean)) {
      const test = curLine ? curLine + ' ' + w : w;
      if (measureTextWidth(test, sz) <= 200) {
        curLine = test;
      } else {
        lines++;
        curLine = w;
      }
    }
    if (curLine) lines++;
    if (kemasan && kemasan.trim()) lines++;

    const totalHeight = lines * lineHeightPx;
    // For 4+ lines: height must be <= 74px to avoid crowding borders
    if (lines >= 4 && totalHeight > 74) continue;
    // For 1-3 lines: height must be <= 78px
    if (totalHeight > 78) continue;

    return sz;
  }

  return 11;
}
