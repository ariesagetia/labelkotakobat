import React from 'react';
import { 
  Printer, 
  Upload, 
  Download, 
  Palette, 
  Settings, 
  FileSpreadsheet, 
  HelpCircle, 
  PlusCircle,
  Eye,
  RefreshCw,
  Globe,
  ExternalLink
} from 'lucide-react';

export default function Header({
  totalItems,
  selectedCount,
  categoryCount,
  totalPages,
  onPrint,
  onOpenUpload,
  onOpenSettings,
  onOpenEditor,
  onOpenGuide,
  onLoadDemo,
  onExportExcel,
  activeTab,
  setActiveTab,
  dataSource = 'gsheet',
  isSyncing = false,
  lastSyncTime = null,
  onSync
}) {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <span className="font-bold text-xl tracking-tighter">Rx</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Apotek Label Master
                </h1>
                <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                  v2.0 Farmasi
                </span>
                
                {/* Data Source Badge: Google Sheet Live vs Upload Lokal */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] bg-slate-50 border-slate-200 shadow-xs">
                  {dataSource === 'gsheet' ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <a 
                        href="https://docs.google.com/spreadsheets/d/1A-alpkAGq00dFGag-v_nOK0lRm_xUmF3/edit?usp=sharing"
                        target="_blank" 
                        rel="noreferrer"
                        title="Klik untuk membuka Google Sheet di tab baru"
                        className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
                      >
                        <span>Google Sheet Live</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                      <button
                        type="button"
                        onClick={() => onSync && onSync(false)}
                        disabled={isSyncing}
                        title={lastSyncTime ? `Terakhir disinkronkan: ${lastSyncTime}. Klik untuk update dari Google Sheets.` : 'Sinkronkan data obat terbaru dari Google Sheets'}
                        className="p-0.5 hover:bg-emerald-100 text-emerald-700 rounded transition-all"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                      </button>
                    </>
                  ) : dataSource === 'github' ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span className="font-semibold text-purple-800">GitHub Default</span>
                      <button
                        type="button"
                        onClick={() => onSync && onSync(false)}
                        title="Ganti dan sinkronkan dengan Google Sheets"
                        className="text-[10px] text-emerald-700 font-bold hover:underline ml-0.5"
                      >
                        Pakai GSheet
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-amber-800">Upload Lokal</span>
                      <button
                        type="button"
                        onClick={() => onSync && onSync(false)}
                        disabled={isSyncing}
                        title="Kembali gunakan data dari Google Sheets resmi"
                        className="text-[10px] text-emerald-700 font-bold hover:underline ml-0.5"
                      >
                        Pakai GSheet
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Generator & Pencetak Label Kotak Obat Multi-Kategori (Terkoneksi Google Sheets)
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex flex-col text-center px-2">
              <span className="font-bold text-slate-800 text-sm">{selectedCount} <span className="text-slate-400 font-normal">/ {totalItems}</span></span>
              <span className="text-slate-500 text-[10px]">Label Dicetak</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-col text-center px-2">
              <span className="font-bold text-purple-700 text-sm">{categoryCount}</span>
              <span className="text-slate-500 text-[10px]">Kategori</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-col text-center px-2">
              <span className="font-bold text-emerald-700 text-sm">{totalPages}</span>
              <span className="text-slate-500 text-[10px]">Halaman Lembar</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Upload Excel */}
            <button
              onClick={onOpenUpload}
              title="Upload file XLSX / CSV sendiri"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Upload XLSX</span>
            </button>

            {/* Edit Data */}
            <button
              onClick={onOpenEditor}
              title="Buka tabel untuk edit nama, kemasan, atau tambah obat"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Data</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title="Pengaturan ukuran kertas, layout grid, dan ukuran font"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Atur Layout</span>
            </button>

            {/* Export Excel */}
            <button
              onClick={onExportExcel}
              title="Download daftar obat saat ini ke file Excel (.xlsx)"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              title="Cetak lembar label (Ctrl+P)"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow-md shadow-purple-200 transition-all hover:scale-102 active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Label ({selectedCount})</span>
            </button>

          </div>

        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Cetak Lembaran</span>
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'colors'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Warna Kategori ({categoryCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'table'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Daftar & Edit Obat ({totalItems})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGuide}
              className="text-xs text-slate-500 hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panduan Standar</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
