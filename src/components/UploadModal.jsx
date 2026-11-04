import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, Download, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { parseExcelFile, detectColumns } from '../utils/excelParser';

export default function UploadModal({
  isOpen,
  onClose,
  onDataLoaded
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importMode, setImportMode] = useState('replace'); // 'replace' or 'append'
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    setError(null);
    setIsLoading(true);
    setFile(selectedFile);

    try {
      const result = await parseExcelFile(selectedFile);
      setParsedData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Gagal membaca file Excel. Pastikan format file adalah .xlsx, .xls, atau .csv');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (!parsedData || !parsedData.items.length) return;
    onDataLoaded(parsedData.items, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Upload File Excel / CSV Label Obat
              </h3>
              <p className="text-xs text-slate-500">
                Mendukung format file .xlsx, .xls, dan .csv (seperti Lampiran 2).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-purple-600 bg-purple-50 scale-[1.01]'
                : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Klik atau Seret & Letakkan File Excel di Sini'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Mendukung format .xlsx, .xls, .csv dengan kolom Item, KATEGORI, KANDUNGAN
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Mengimpor File</p>
                <p className="text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
              <p className="text-xs text-purple-700 mt-2 font-semibold">Sedang membaca dan memproses baris obat...</p>
            </div>
          )}

          {/* Parsed Summary and Preview */}
          {parsedData && !isLoading && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-xs">
                      Berhasil membaca {parsedData.rowCount} baris obat!
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Kolom terdeteksi: <strong>{parsedData.colMap.nama}</strong> (Nama), <strong>{parsedData.colMap.kategori}</strong> (Kategori), <strong>{parsedData.colMap.kandungan}</strong> (Kandungan)
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample 3 rows preview */}
              <div>
                <p className="font-semibold text-slate-800 mb-1.5 text-xs">Contoh 3 Obat Pertama yang Dibaca:</p>
                <div className="space-y-1.5">
                  {parsedData.items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{it.nama}</span>
                        {it.kemasan && <span className="ml-2 font-semibold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 text-[10px]">{it.kemasan}</span>}
                        {it.kandungan && <p className="text-[11px] text-slate-500">{it.kandungan}</p>}
                      </div>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                        {it.kategori}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import Mode: Replace vs Append */}
              <div className="pt-2">
                <span className="font-semibold text-slate-800 block mb-1.5">Metode Impor:</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === 'replace' ? 'border-purple-600 bg-purple-50/50 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    Ganti Semua Data Sekarang
                  </label>
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === 'append' ? 'border-purple-600 bg-purple-50/50 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    Tambahkan ke Data Saat Ini
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Download Sample Template section */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Belum punya format Excel?</span>
            <div className="flex items-center gap-2">
              <a
                href="/template_label_obat.xlsx"
                download="template_label_obat.xlsx"
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Template Kosong (.xlsx)</span>
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/data_obat_lampiran2.xlsx"
                download="data_obat_lampiran2.xlsx"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Data Asli Lampiran 2 (.xlsx)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedData || !parsedData.items.length}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <span>Terapkan ke Generator Label</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
