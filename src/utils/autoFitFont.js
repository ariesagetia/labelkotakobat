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
 * Measure pixel width of text rendered in Arial Bold uppercase
 * @param {string} text 
 * @param {number} sizePt font size in points
 * @returns {number} width in pixels (at standard 96 DPI screen/print resolution)
 */
export function measureTextWidth(text, sizePt) {
  let units = 0;
  const str = String(text || '').toUpperCase();
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    units += (ARIAL_BOLD_UNITS[ch] !== undefined ? ARIAL_BOLD_UNITS[ch] : 650);
  }
  return (units / 1000) * sizePt * (96 / 72);
}

/**
 * Simulate rendering lines and total height inside the 65mm x 26mm top half container
 * @param {string} nama 
 * @param {string} kemasan 
 * @param {number} sizePt 
 * @returns {{ ok: boolean, totalLines: number, totalHeight: number, reason?: string }}
 */
export function simulateTextFit(nama, kemasan, sizePt) {
  const lineHeightPx = sizePt * (96 / 72) * 1.12;
  const words = (nama || '').trim().split(/\s+/).filter(Boolean);
  
  // 1. Single word width limit: max 200px
  // Prevents words like DEXAMETHASONE or PREDNISOLONE from splitting mid-word
  for (const w of words) {
    if (measureTextWidth(w, sizePt) > 200) {
      return { ok: false, reason: 'word_too_wide' };
    }
  }

  // 2. Wrap nama into lines (max line width 210px inside card)
  let lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (measureTextWidth(test, sizePt) <= 210) {
      cur = test;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);

  // 3. Wrap kemasan into lines
  let kLines = 0;
  if (kemasan && kemasan.trim()) {
    const kWords = kemasan.trim().split(/\s+/).filter(Boolean);
    let kCur = '';
    for (const kw of kWords) {
      const testK = kCur ? kCur + ' ' + kw : kw;
      if (measureTextWidth(testK, sizePt) <= 210) {
        kCur = testK;
      } else {
        kLines++;
        kCur = kw;
      }
    }
    if (kCur) kLines++;
  }

  const totalLines = lines.length + kLines;
  const totalHeight = totalLines * lineHeightPx;

  // Max safe height thresholds to guarantee text NEVER touches top border or divider:
  // Usable height inside top half is ~89.2px.
  // For 4+ lines: height must be <= 74px (leaves >= 15px clearance)
  if (totalLines >= 4 && totalHeight > 74) {
    return { ok: false, reason: '4lines_too_tall', totalHeight };
  }
  // For 1-3 lines: height must be <= 78px (leaves >= 11px clearance)
  if (totalHeight > 78) {
    return { ok: false, reason: 'exceeds_max_safe_height', totalHeight };
  }

  return { ok: true, totalLines, totalHeight, lines };
}

/**
 * Calculate the optimal font size for a medicine label.
 * - Standard/normal medicines (~88-92%) KEEP FULL baseSize (17 pt Ekstra Besar).
 * - Medicines with long words (e.g. DEXAMETHASONE) or multiple lines step down slightly (16pt, 15pt, 14.5pt)
 *   so they never split awkwardly and never touch the top border or middle divider.
 * 
 * @param {string} nama 
 * @param {string} kemasan 
 * @param {number} baseSize default 17 pt
 * @returns {number} optimal font size in pt
 */
export function getOptimalItemFontSize(nama = '', kemasan = '', baseSize = 17) {
  // Gradual step-downs from baseSize
  const candidateSteps = [17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13, 12.5, 12, 11];
  for (const sz of candidateSteps) {
    if (sz > baseSize) continue;
    if (simulateTextFit(nama, kemasan, sz).ok) {
      return sz;
    }
  }
  return 11;
}
