import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { SAMPLE_DATA } from './src/data/sampleData.js';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// 1. Full data from Lampiran 2
const cleanData = SAMPLE_DATA.map(d => ({
  "Nama Obat": d.nama,
  "Kemasan / Satuan": d.kemasan.replace(/\s+/g, ' ').trim(),
  "Kategori": d.kategori,
  "Kandungan / Zat Aktif": d.kandungan
}));

const wbFull = XLSX.utils.book_new();
const wsFull = XLSX.utils.json_to_sheet(cleanData);
XLSX.utils.book_append_sheet(wbFull, wsFull, "Data Obat");
XLSX.writeFile(wbFull, "public/data_obat_lampiran2.xlsx");

// 2. Format also with standard columns as in user's prompt (Item, KATEGORI, KANDUNGAN)
const rawData = SAMPLE_DATA.map(d => ({
  "Item": d.rawItem,
  "KATEGORI": d.kategori,
  "KANDUNGAN": d.kandungan
}));
const wbRaw = XLSX.utils.book_new();
const wsRaw = XLSX.utils.json_to_sheet(rawData);
XLSX.utils.book_append_sheet(wbRaw, wsRaw, "Item List");
XLSX.writeFile(wbRaw, "public/format_asli_lampiran2.xlsx");

// 3. Blank template for user
const templateData = [
  { "Nama Obat": "PARACETAMOL 500 MG", "Kemasan / Satuan": "TAB @100", "Kategori": "GENERIK", "Kandungan / Zat Aktif": "PARACETAMOL 500MG" },
  { "Nama Obat": "AMOXICILLIN 500 MG", "Kemasan / Satuan": "KAP @100", "Kategori": "ANTIBIOTIK", "Kandungan / Zat Aktif": "AMOXICILLIN 500MG" },
  { "Nama Obat": "CETIRIZINE 10 MG", "Kemasan / Satuan": "TAB @30", "Kategori": "ALERGI", "Kandungan / Zat Aktif": "CETIRIZINE 10MG" }
];
const wbTpl = XLSX.utils.book_new();
const wsTpl = XLSX.utils.json_to_sheet(templateData);
XLSX.utils.book_append_sheet(wbTpl, wsTpl, "Template Label Obat");
XLSX.writeFile(wbTpl, "public/template_label_obat.xlsx");

console.log("Created public Excel files successfully!");
