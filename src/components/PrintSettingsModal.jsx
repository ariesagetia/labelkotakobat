import React from 'react';
import { Settings, X, RotateCcw, Sliders, Layout, Type, Scissors, Palette } from 'lucide-react';
import { AVAILABLE_FONTS, FONT_SIZE_PRESETS } from '../utils/fontConstants';

export default function PrintSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pengaturan Cetak & Format Label
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan ukuran kertas, tata letak, jenis font, ukuran, warna teks, dan background label.
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Paper Size & Grid Dimensions */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Layout className="w-4 h-4 text-purple-700" />
              <span>Ukuran Kertas & Format Grid</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ukuran Kertas
                </label>
                <select
                  value={settings.paperSize || 'A4'}
                  onChange={(e) => onUpdateSettings({ paperSize: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="F4">F4 / Folio (215 × 330 mm)</option>
                  <option value="Letter">Letter (216 × 279 mm)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Format Grid Per Lembar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Kolom:</span>
                    <select
                      value={settings.columns || 3}
                      onChange={(e) => onUpdateSettings({ columns: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold"
                    >
                      <option value="2">2 Kolom</option>
                      <option value="3">3 Kolom (Lampiran 1)</option>
                      <option value="4">4 Kolom</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Baris:</span>
                    <select
                      value={settings.rows || 5}
                      onChange={(e) => onUpdateSettings({ rows: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold"
                    >
                      <option value="3">3 Baris</option>
                      <option value="4">4 Baris</option>
                      <option value="5">5 Baris (Lampiran 1)</option>
                      <option value="6">6 Baris</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
              Kapasitas: <strong>{(settings.columns || 3) * (settings.rows || 5)} label per lembar</strong> (Sesuai dengan layout 15 kotak obat di Lampiran 1).
            </div>
          </div>

          {/* Typography: Jenis, Ukuran & Warna Font */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Type className="w-4 h-4 text-purple-700" />
              <span>Pengaturan Tipografi: Jenis, Ukuran & Warna Font</span>
            </div>

            {/* 1. Jenis Font */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Jenis Huruf (Font Family)
              </label>
              <select
                value={settings.fontFamily || 'Montserrat'}
                onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-purple-500"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Warna Font */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-purple-600" /> Warna Huruf (Font Color)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textColorMode: 'category' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    (!settings.textColorMode || settings.textColorMode === 'category')
                      ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Auto Kontras
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textColorMode: 'white', globalTextColor: '#ffffff' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    settings.textColorMode === 'white'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Putih Murni
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textColorMode: 'black', globalTextColor: '#111827' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    settings.textColorMode === 'black'
                      ? 'bg-slate-200 text-slate-900 border-slate-900 font-bold'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Hitam Pekat
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ textColorMode: 'yellow', globalTextColor: '#FACC15' })}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                    settings.textColorMode === 'yellow'
                      ? 'bg-amber-100 text-amber-950 border-amber-500 font-bold'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Kuning Farmasi
                </button>
              </div>

              {/* Custom Color Selector */}
              <div className="flex items-center space-x-2 mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600">Atau Pilih Warna Bebas:</span>
                <input
                  type="color"
                  value={settings.globalTextColor || '#ffffff'}
                  onChange={(e) => onUpdateSettings({ textColorMode: 'custom', globalTextColor: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={(settings.globalTextColor || '#ffffff').toUpperCase()}
                  onChange={(e) => onUpdateSettings({ textColorMode: 'custom', globalTextColor: e.target.value })}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold rounded border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* 3. Ukuran Font Presets & Sliders */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-700">Preset Ukuran Cepat:</span>
                <div className="flex gap-1">
                  {FONT_SIZE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onUpdateSettings({
                        fontSizeNama: preset.nama,
                        fontSizeKemasan: preset.kemasan,
                        fontSizeKandungan: preset.kandungan
                      })}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 hover:bg-purple-100 hover:text-purple-900 border border-slate-200"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">Nama Obat:</span>
                    <span className="font-bold text-purple-700">{settings.fontSizeNama || 13} pt</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    step="0.5"
                    value={settings.fontSizeNama || 13}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (settings.syncKemasanSize !== false) {
                        onUpdateSettings({ fontSizeNama: val, fontSizeKemasan: val });
                      } else {
                        onUpdateSettings({ fontSizeNama: val });
                      }
                    }}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">Bentuk, Kemasan & Besaran Obat:</span>
                      <label className="inline-flex items-center gap-1 cursor-pointer text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 select-none">
                        <input
                          type="checkbox"
                          checked={settings.syncKemasanSize !== false}
                          onChange={(e) => {
                            const isSynced = e.target.checked;
                            onUpdateSettings({
                              syncKemasanSize: isSynced,
                              fontSizeKemasan: isSynced ? (settings.fontSizeNama || 13) : settings.fontSizeKemasan
                            });
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500 w-3 h-3"
                        />
                        <span>Sama dengan nama obat</span>
                      </label>
                    </div>
                    <span className="font-bold text-purple-700">
                      {(settings.syncKemasanSize !== false ? (settings.fontSizeNama || 13) : (settings.fontSizeKemasan || 13))} pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="20"
                    step="0.5"
                    value={settings.syncKemasanSize !== false ? (settings.fontSizeNama || 13) : (settings.fontSizeKemasan || 13)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (settings.syncKemasanSize !== false) {
                        onUpdateSettings({ fontSizeNama: val, fontSizeKemasan: val });
                      } else {
                        onUpdateSettings({ fontSizeKemasan: val });
                      }
                    }}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">Kandungan / Zat Aktif:</span>
                    <span className="font-bold text-purple-700">{settings.fontSizeKandungan || 9} pt</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="14"
                    step="0.5"
                    value={settings.fontSizeKandungan || 9}
                    onChange={(e) => onUpdateSettings({ fontSizeKandungan: Number(e.target.value) })}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 4. Ketebalan & Huruf Besar */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ketebalan Huruf (Weight)
                </label>
                <select
                  value={settings.fontWeight || '800'}
                  onChange={(e) => onUpdateSettings({ fontWeight: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                >
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800 - Rekomendasi)</option>
                  <option value="900">Black / Sangat Tebal (900)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Format Huruf Kapital
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({
                    textTransform: settings.textTransform === 'none' ? 'uppercase' : 'none'
                  })}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold transition-colors ${
                    settings.textTransform !== 'none'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {settings.textTransform !== 'none' ? 'SEMUA KAPITAL (ABC)' : 'Format Asli (Abc)'}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showCategoryTag || false}
                  onChange={(e) => onUpdateSettings({ showCategoryTag: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Tampilkan badge nama kategori kecil di pojok label
                </span>
              </label>
            </div>
          </div>

          {/* Divider Line Between Item & Kandungan */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <Scissors className="w-4 h-4 text-purple-700" />
                <span>Garis Pemisah Antara Item & Kandungan</span>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.showDivider !== undefined ? settings.showDivider : true}
                  onChange={(e) => onUpdateSettings({ showDivider: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-bold text-purple-900">
                  Aktifkan Garis
                </span>
              </label>
            </div>

            {(settings.showDivider !== false) && (
              <div className="space-y-3 p-3 rounded-xl bg-purple-50/50 border border-purple-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Bentuk Garis
                    </label>
                    <select
                      value={settings.dividerStyle || 'solid'}
                      onChange={(e) => onUpdateSettings({ dividerStyle: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-xs"
                    >
                      <option value="solid">Solid (Garis Lurus Tegas)</option>
                      <option value="dashed">Dashed (Garis Putus-Putus)</option>
                      <option value="dotted">Dotted (Garis Titik-Titik)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-600">Panjang Garis:</span>
                      <span className="font-bold text-purple-700">
                        {settings.dividerWidth !== undefined ? settings.dividerWidth : 100}%
                        {(settings.dividerWidth === 100 || settings.dividerWidth === undefined) && ' (Penuh)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={settings.dividerWidth !== undefined ? settings.dividerWidth : 100}
                      onChange={(e) => onUpdateSettings({ dividerWidth: Number(e.target.value) })}
                      className="w-full accent-purple-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-600">Ketebalan Garis:</span>
                      <span className="font-bold text-purple-700">{settings.dividerThickness || 1.5} px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3.5"
                      step="0.5"
                      value={settings.dividerThickness || 1.5}
                      onChange={(e) => onUpdateSettings({ dividerThickness: Number(e.target.value) })}
                      className="w-full accent-purple-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-600">Transparansi / Opasitas:</span>
                      <span className="font-bold text-purple-700">{settings.dividerOpacity || 85}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="5"
                      value={settings.dividerOpacity || 85}
                      onChange={(e) => onUpdateSettings({ dividerOpacity: Number(e.target.value) })}
                      className="w-full accent-purple-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Spacing & Cut Margin */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Scissors className="w-4 h-4 text-purple-700" />
              <span>Jarak & Garis Potong (Margin / Gap)</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-600">Margin Tepi Kertas:</span>
                  <span className="font-bold text-purple-700">{settings.pageMargin || 8} mm</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="1"
                  value={settings.pageMargin || 8}
                  onChange={(e) => onUpdateSettings({ pageMargin: Number(e.target.value) })}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-600">Jarak Antar Label (Gap):</span>
                  <span className="font-bold text-purple-700">{settings.labelGap || 3} mm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={settings.labelGap || 3}
                  onChange={(e) => onUpdateSettings({ labelGap: Number(e.target.value) })}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tipe Garis Pinggir / Batas
                </label>
                <select
                  value={settings.borderStyle || 'solid'}
                  onChange={(e) => onUpdateSettings({ borderStyle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="solid">Garis Solid (Tegas)</option>
                  <option value="dashed">Garis Putus-Putus (Gunting)</option>
                  <option value="dotted">Garis Titik-Titik</option>
                  <option value="none">Tanpa Garis Luar</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sudut Kotak (Radius)
                </label>
                <select
                  value={settings.borderRadius || 0}
                  onChange={(e) => onUpdateSettings({ borderRadius: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="0">0px (Siku / Persegi Tegak - Mudah Digunting)</option>
                  <option value="3">3px (Sedikit Membulat)</option>
                  <option value="6">6px (Membulat Halus)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onResetSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Pengaturan Awal</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm"
          >
            Simpan & Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
