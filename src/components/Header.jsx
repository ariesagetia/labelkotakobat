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
  Globe
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
  dataSource = 'github',
  isSyncingGitHub = false,
  lastSyncTime = null,
  onSyncGitHub
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
                
                {/* Data Source Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] bg-slate-50 border-slate-200">
                  {dataSource === 'github' ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-semibold text-slate-700">GitHub Default</span>
                      <button
                        type="button"
                        onClick={() => onSyncGitHub && onSyncGitHub(false)}
                        disabled={isSyncingGitHub}
                        title={lastSyncTime ? `Terakhir disinkronkan: ${lastSyncTime}. Klik untuk update dari GitHub.` : 'Sinkronkan data obat terbaru dari GitHub'}
                        className="p-0.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded transition-all"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncingGitHub ? 'animate-spin text-purple-600' : ''}`} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-amber-800">Upload Lokal</span>
                      <button
                        type="button"
                        onClick={() => onSyncGitHub && onSyncGitHub(false)}
                        disabled={isSyncingGitHub}
                        title="Kembali gunakan data default dari repositori GitHub"
                        className="text-[10px] text-purple-700 font-bold hover:underline ml-0.5"
                      >
                        Pakai GitHub
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Generator & Pencetak Label Kotak Obat Multi-Kategori (Sesuai Lampiran 1 & 2)
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
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Print Guide */}
            <button
              onClick={onOpenGuide}
              title="Tips & panduan mencetak agar warna latar belakang keluar"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Export Excel */}
            <button
              onClick={onExportExcel}
              title="Unduh data saat ini sebagai file Excel .xlsx"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh XLSX</span>
            </button>

            {/* PRIMARY CETAK / PRINT BUTTON */}
            <button
              onClick={onPrint}
              disabled={selectedCount === 0}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg shadow-md transition-all ${
                selectedCount > 0
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white shadow-purple-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>CETAK LABEL ({selectedCount})</span>
            </button>

          </div>
        </div>

        {/* Sub-navigation Tabs: Preview Lembar vs Pengaturan Warna Kategori */}
        <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Lembar Cetak ({totalPages} Hal)</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'colors'
                ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Pilihan Warna Kategori ({categoryCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table'
                ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Daftar Data Obat ({totalItems})</span>
          </button>
        </div>

      </div>
    </header>
  );
}
