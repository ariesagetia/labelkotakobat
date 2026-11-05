import { parseExcelArrayBuffer } from './excelParser';

export const GSHEET_CONFIG = {
  id: '1A-alpkAGq00dFGag-v_nOK0lRm_xUmF3',
  viewUrl: 'https://docs.google.com/spreadsheets/d/1A-alpkAGq00dFGag-v_nOK0lRm_xUmF3/edit?usp=sharing',
  exportUrl: 'https://docs.google.com/spreadsheets/d/1A-alpkAGq00dFGag-v_nOK0lRm_xUmF3/export?format=xlsx'
};

/**
 * Fetch medicine dataset directly from Google Sheets in real-time
 */
export async function fetchDataFromGoogleSheet() {
  const timestamp = Date.now();
  const url = `${GSHEET_CONFIG.exportUrl}&t=${timestamp}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const parsed = parseExcelArrayBuffer(arrayBuffer);
    return {
      ...parsed,
      sourceUrl: GSHEET_CONFIG.viewUrl,
      source: 'gsheet',
      fetchedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Gagal fetch dari Google Sheets, mencoba fallback lokal:', err);
    // Fallback: local public/data_obat_default.xlsx
    const fallbackRes = await fetch(`/data_obat_default.xlsx?t=${timestamp}`, { cache: 'no-store' });
    if (!fallbackRes.ok) {
      throw err;
    }
    const arrayBuffer = await fallbackRes.arrayBuffer();
    const parsed = parseExcelArrayBuffer(arrayBuffer);
    return {
      ...parsed,
      sourceUrl: '/data_obat_default.xlsx',
      source: 'gsheet-fallback',
      fetchedAt: new Date().toISOString()
    };
  }
}
