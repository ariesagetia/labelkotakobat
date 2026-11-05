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
  const rawExportUrl = `${GSHEET_CONFIG.exportUrl}&t=${timestamp}`;

  // Priority URLs to bypass CORS restrictions on Google Drive downloads in browser
  const candidateUrls = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rawExportUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(rawExportUrl)}`,
    rawExportUrl,
    `/data_obat_default.xlsx?t=${timestamp}`
  ];

  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      // Ensure we actually received an XLSX file (ZIP header: 0x50, 0x4B)
      const bytes = new Uint8Array(arrayBuffer);
      if (bytes.length < 100 || bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
        throw new Error('Respons bukan file spreadsheet XLSX yang valid');
      }

      const parsed = parseExcelArrayBuffer(arrayBuffer);
      if (!parsed.items || parsed.items.length === 0) {
        throw new Error('Data spreadsheet kosong');
      }

      return {
        ...parsed,
        sourceUrl: GSHEET_CONFIG.viewUrl,
        source: 'gsheet',
        fetchedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn(`Gagal fetch dari ${url}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Gagal mengunduh data dari Google Sheets');
}
