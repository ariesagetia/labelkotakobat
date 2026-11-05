import * as XLSX from 'xlsx';

// Known pharmaceutical forms and packaging keywords in Indonesia
const FORMS_REGEX = /\b(TAB|KAP|CAPS|SYR|CR|GEL|OINT|INHALER|DROPS|SACH|STRIP|BOX|BTL|PCS|VIALS|DISKUS|SUPP|OVULA|LOT|EMULTION|SUSP|PATCH|AMPLOP|ROLL|TUBE|SPRAY|NEBULES)\b/i;

/**
 * Smartly parse a raw medicine item name into display lines
 * e.g. "AERIUS 5 MG TAB" -> { nama: "AERIUS 5 MG", kemasan: "TAB" }
 * e.g. "ALLERON 4 MG TAB" -> { nama: "ALLERON 4 MG", kemasan: "TAB" }
 * e.g. "ACIFAR CR 5 GR" -> { nama: "ACIFAR CR", kemasan: "5 GR" }
 */
export function smartParseItem(rawItem, existingKemasan = '') {
  const item = (rawItem || '').trim();
  if (existingKemasan && existingKemasan.trim()) {
    return {
      nama: item,
      kemasan: existingKemasan.trim()
    };
  }

  // Check if item contains dosage or size at the end (e.g., "5 GR", "60 ML", "100 ML")
  const sizeMatch = item.match(/\b(\d+(?:\.\d+)?\s*(?:GR|ML|MG|CM|M|IU|MCG|CC|G)(?:\s*X\s*[\d\.]+\s*(?:CM|M))?)$/i);
  if (sizeMatch) {
    const size = sizeMatch[1].trim();
    const rest = item.substring(0, item.length - size.length).trim();
    return {
      nama: rest,
      kemasan: size
    };
  }

  // Check if item ends with a form like TAB, KAP, CAPS, SYR, etc. with exact word boundaries
  const formMatch = item.match(/^(.*?)\s+\b(TAB|KAP|CAPS|SYR|CR|GEL|OINT|INHALER|DROPS|SACH|STRIP|BOX|BTL|PCS|VIALS|DISKUS|SUPP|OVULA|LOT|EMULTION|SUSP|PATCH|AMPLOP|ROLL|TUBE|SPRAY|NEBULES)\b\s*(.*?)$/i);
  if (formMatch) {
    const baseName = formMatch[1].trim();
    const form = formMatch[2].trim().toUpperCase();
    const extra = formMatch[3].trim();
    return {
      nama: baseName,
      kemasan: extra ? `${form} ${extra}` : form
    };
  }

  return {
    nama: item,
    kemasan: ''
  };
}

/**
 * Detect matching column names from Excel headers
 */
export function detectColumns(headers) {
  const colMap = {
    nama: '',
    kategori: '',
    kandungan: '',
    kemasan: ''
  };

  headers.forEach(h => {
    const lower = h.toString().trim().toLowerCase();
    
    // Nama / Item
    if (!colMap.nama) {
      if (lower === 'item' || lower === 'nama' || lower === 'nama obat' || lower === 'product' || lower === 'produk' || lower === 'deskripsi') {
        colMap.nama = h;
      }
    }
    // Kategori
    if (!colMap.kategori) {
      if (lower === 'kategori' || lower === 'category' || lower === 'golongan' || lower === 'jenis' || lower === 'tipe') {
        colMap.kategori = h;
      }
    }
    // Kandungan
    if (!colMap.kandungan) {
      if (lower === 'kandungan' || lower === 'komposisi' || lower === 'zat aktif' || lower === 'active ingredient' || lower === 'ingred') {
        colMap.kandungan = h;
      }
    }
    // Kemasan / Isi / Satuan
    if (!colMap.kemasan) {
      if (lower === 'kemasan' || lower === 'satuan' || lower === 'isi' || lower === 'packaging' || lower === 'dosis' || lower === 'bentuk') {
        colMap.kemasan = h;
      }
    }
  });

  // Fallbacks if not detected
  if (!colMap.nama && headers.length > 0) colMap.nama = headers[0];
  if (!colMap.kategori && headers.length > 1) colMap.kategori = headers[1];
  if (!colMap.kandungan && headers.length > 2) colMap.kandungan = headers[2];

  return colMap;
}

/**
 * Parse an Excel workbook from an ArrayBuffer or Uint8Array
 */
export function parseExcelArrayBuffer(arrayBuffer, customColMap = null) {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  
  // Read first worksheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert to JSON with header array
  const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (!rawJson || rawJson.length < 2) {
    throw new Error('File Excel tidak memiliki data atau baris tidak cukup.');
  }

  // Header row
  const headers = rawJson[0].map(h => (h !== undefined && h !== null ? String(h).trim() : ''));
  const colMap = customColMap || detectColumns(headers);

  // Find column indices
  const idxNama = headers.indexOf(colMap.nama);
  const idxKategori = headers.indexOf(colMap.kategori);
  const idxKandungan = headers.indexOf(colMap.kandungan);
  const idxKemasan = colMap.kemasan ? headers.indexOf(colMap.kemasan) : -1;

  const items = [];
  const dataRows = rawJson.slice(1);

  dataRows.forEach((row, index) => {
    if (!row || row.length === 0) return;
    
    const rawItem = idxNama >= 0 && row[idxNama] ? String(row[idxNama]).trim() : '';
    const kategori = idxKategori >= 0 && row[idxKategori] ? String(row[idxKategori]).trim().toUpperCase() : 'LAINNYA';
    const kandungan = idxKandungan >= 0 && row[idxKandungan] ? String(row[idxKandungan]).trim() : '';
    const explicitKemasan = idxKemasan >= 0 && row[idxKemasan] ? String(row[idxKemasan]).trim() : '';

    if (!rawItem && !kandungan) return; // skip empty rows

    const parsed = smartParseItem(rawItem, explicitKemasan);

    items.push({
      id: `item-${index + 1}`,
      rawItem,
      nama: parsed.nama || rawItem,
      kemasan: parsed.kemasan,
      kategori: kategori || 'LAINNYA',
      kandungan: kandungan || ''
    });
  });

  return {
    items,
    headers,
    colMap,
    sheetNames: workbook.SheetNames,
    rowCount: items.length
  };
}

/**
 * Parse uploaded file (.xlsx, .xls, .csv)
 */
export async function parseExcelFile(file, customColMap = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = parseExcelArrayBuffer(e.target.result, customColMap);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export items to an Excel (.xlsx) file
 */
export function exportItemsToExcel(items, filename = 'daftar_label_obat.xlsx') {
  const exportData = items.map((item, idx) => ({
    "No": idx + 1,
    "Nama Obat": item.nama,
    "Bentuk / Kemasan": item.kemasan,
    "Kategori": item.kategori,
    "Kandungan": item.kandungan,
    "Item Lengkap": item.rawItem || `${item.nama} ${item.kemasan}`.trim()
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Label Obat");
  XLSX.writeFile(workbook, filename);
}
