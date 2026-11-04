import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  X, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  Globe,
  CloudUpload,
  RefreshCw,
  ExternalLink,
  Key,
  ShieldCheck,
  Check
} from 'lucide-react';
import { parseExcelFile, detectColumns } from '../utils/excelParser';
import { 
  GITHUB_CONFIG, 
  pushExcelToGitHub, 
  getSavedGitHubToken, 
  saveGitHubToken 
} from '../utils/githubSync';

export default function UploadModal({
  isOpen,
  onClose,
  onDataLoaded,
  onSyncGitHub,
  isSyncingGitHub = false,
  dataSource = 'github'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importMode, setImportMode] = useState('replace'); // 'replace' or 'append'
  const fileInputRef = useRef(null);

  // GitHub Push State
  const [showGitHubPush, setShowGitHubPush] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [rememberToken, setRememberToken] = useState(true);
  const [isPushingGitHub, setIsPushingGitHub] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);
  const [pushError, setPushError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setGithubToken(getSavedGitHubToken());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    setError(null);
    setPushSuccess(false);
    setPushError(null);
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

  const handleApplyLocal = () => {
    if (!parsedData || !parsedData.items.length) return;
    onDataLoaded(parsedData.items, importMode, false);
    onClose();
  };

  const handlePushToGitHub = async () => {
    if (!file) return;
    if (!githubToken.trim()) {
      setPushError('Harap masukkan Personal Access Token (PAT) GitHub.');
      return;
    }

    setIsPushingGitHub(true);
    setPushError(null);
    setPushSuccess(false);

    try {
      if (rememberToken) {
        saveGitHubToken(githubToken.trim());
      } else {
        saveGitHubToken('');
      }

      await pushExcelToGitHub(
        file,
        githubToken.trim(),
        `Update data_obat_default.xlsx via Apotek Label Master (${parsedData?.rowCount || 0} obat)`
      );

      setPushSuccess(true);
      // Also apply as active data with dataSource = 'github'
      onDataLoaded(parsedData.items, 'replace', true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      setPushError(err.message || 'Gagal mengupload file ke GitHub.');
    } finally {
      setIsPushingGitHub(false);
    }
  };

  // Prepare a download of the current file as data_obat_default.xlsx for manual drag & drop
  const handleDownloadAsDefault = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_obat_default.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Upload File Excel / Sinkronisasi Data
              </h3>
              <p className="text-xs text-slate-500">
                Pilih file Excel baru atau sinkronkan data default langsung dari GitHub.
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
          
          {/* GitHub Auto-Sync Quick Bar */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  Data Terpusat di GitHub ({GITHUB_CONFIG.owner}/{GITHUB_CONFIG.repo})
                </p>
                <p className="text-[11px] text-slate-600">
                  Semua browser & komputer membaca file default dari GitHub secara otomatis.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onSyncGitHub && onSyncGitHub(false);
                onClose();
              }}
              disabled={isSyncingGitHub}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-800 hover:bg-purple-50 font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGitHub ? 'animate-spin' : ''}`} />
              <span>{isSyncingGitHub ? 'Menyinkronkan...' : 'Muat dari GitHub'}</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
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
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2.5 shadow-sm">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Klik atau Seret & Letakkan File Excel Baru di Sini'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Mendukung format .xlsx, .xls, .csv dengan kolom Item/Nama, Kategori, Kandungan
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

          {/* Parsed Summary and Actions */}
          {parsedData && !isLoading && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs">
                      Berhasil membaca {parsedData.rowCount} baris obat!
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Kolom: <strong>{parsedData.colMap.nama}</strong> (Nama), <strong>{parsedData.colMap.kategori}</strong> (Kategori), <strong>{parsedData.colMap.kandungan}</strong> (Kandungan)
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Preview */}
              <div>
                <p className="font-semibold text-slate-800 mb-1.5 text-xs">Contoh 3 Baris Pertama:</p>
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
                <span className="font-semibold text-slate-800 block mb-1.5">Metode Penerapan di Browser Ini:</span>
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

              {/* GitHub Sync Section */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGitHubPush(!showGitHubPush)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-purple-700" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        Jadikan Default di GitHub (Agar Otomatis Tampil di Seluruh Browser & HP)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Klik di sini untuk push langsung ke repositori atau upload manual via web GitHub
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-700">
                    {showGitHubPush ? 'Tutup ▲' : 'Buka Opsi ▼'}
                  </span>
                </button>

                {showGitHubPush && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-purple-200 space-y-4 animate-in fade-in">
                    
                    {/* Method 1: Push Direct with Token */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-purple-700" />
                          <span>Cara 1: Upload Otomatis via GitHub Token (PAT)</span>
                        </label>
                        <a
                          href="https://github.com/settings/tokens/new?scopes=repo&description=Apotek+Label+Master"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-semibold text-purple-700 hover:underline inline-flex items-center gap-0.5"
                          title="Buat Classic Token dengan izin 'repo' tercentang otomatis"
                        >
                          <span>Buat Token (Izin repo)</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="Masukkan token GitHub (ghp_...)"
                          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handlePushToGitHub}
                          disabled={isPushingGitHub || !githubToken.trim()}
                          className="px-4 py-2 bg-purple-700 text-white rounded-lg font-bold text-xs hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          {isPushingGitHub ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Mengupload...</span>
                            </>
                          ) : (
                            <>
                              <CloudUpload className="w-3.5 h-3.5" />
                              <span>Push ke GitHub</span>
                            </>
                          )}
                        </button>
                      </div>

                      <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberToken}
                          onChange={(e) => setRememberToken(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>Ingat token ini di browser ini untuk upload berikutnya</span>
                      </label>

                      {pushSuccess && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Berhasil!</strong> File Excel telah diperbarui di GitHub. Semua browser kini akan memuat data ini sebagai default!</span>
                        </div>
                      )}

                      {pushError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">{pushError}</p>
                              {pushError.includes('Resource not accessible') && (
                                <div className="text-[11px] text-red-700 mt-1.5 space-y-1 bg-white/70 p-2.5 rounded-lg border border-red-200">
                                  <p className="font-bold text-red-900">Penyebab: Token belum memiliki izin tulis (Write/Contents):</p>
                                  <p>
                                    1. <strong>Jika Fine-grained token:</strong> Di bagian <em>Repository permissions</em> &rarr; <em>Contents</em>, wajib ubah menjadi <strong>Read and write</strong>.
                                  </p>
                                  <p>
                                    2. <strong>Jika Tokens (classic):</strong> Wajib centang kotak <strong><code>repo</code></strong> (Full control of private repositories).
                                  </p>
                                  <p className="text-slate-600 pt-0.5">
                                    💡 <em>Tips:</em> Anda juga bisa gunakan <strong>Cara 2</strong> di bawah (tinggal drag & drop file ke web GitHub, tanpa perlu token).
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Method 2: Manual Drag & Drop via Web */}
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <p className="font-bold text-slate-800 text-xs">
                        Cara 2: Upload Manual via Web GitHub (Tanpa Token)
                      </p>
                      <p className="text-[11px] text-slate-600">
                        1. Unduh file ini dengan nama <code>data_obat_default.xlsx</code>.<br/>
                        2. Buka folder repositori di GitHub dan seret (drag & drop) file tersebut untuk mengganti file lama.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleDownloadAsDefault}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>1. Unduh data_obat_default.xlsx</span>
                        </button>
                        <a
                          href={GITHUB_CONFIG.repoUploadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs"
                        >
                          <span>2. Buka GitHub untuk Upload</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

          {/* Template Downloads */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Unduh referensi:</span>
            <div className="flex items-center gap-2">
              <a
                href="/template_label_obat.xlsx"
                download="template_label_obat.xlsx"
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template Kosong (.xlsx)</span>
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="/data_obat_default.xlsx"
                download="data_obat_default.xlsx"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Data Default GitHub (.xlsx)</span>
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
            onClick={handleApplyLocal}
            disabled={!parsedData || !parsedData.items.length}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <span>Terapkan di Browser Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
