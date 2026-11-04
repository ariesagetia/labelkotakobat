import React, { useState } from 'react';
import { Type, Sliders, Palette, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { AVAILABLE_FONTS, FONT_SIZE_PRESETS, QUICK_FONT_COLORS } from '../utils/fontConstants';

export default function TypographyToolbar({
  settings,
  onUpdateSettings
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentFont = AVAILABLE_FONTS.find(f => f.id === settings.fontFamily) || AVAILABLE_FONTS[0];

  const handleApplyPreset = (preset) => {
    onUpdateSettings({
      fontSizeNama: preset.nama,
      fontSizeKemasan: preset.kemasan,
      fontSizeKandungan: preset.kandungan
    });
  };

  return (
    <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Title & Quick Font Family Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Tipografi & Font
              </span>
              <span className="text-[10px] text-slate-500">
                Ubah jenis, ukuran & warna teks
              </span>
            </div>
          </div>

          {/* 1. JENIS FONT DROPDOWN */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-600">Font:</span>
            <select
              value={settings.fontFamily || 'Montserrat'}
              onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              style={{ fontFamily: currentFont.family }}
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. WARNA FONT QUICK BUTTONS */}
          <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-purple-600" /> Teks:
            </span>

            {/* Auto (Category) */}
            <button
              onClick={() => onUpdateSettings({ textColorMode: 'category' })}
              title="Gunakan warna kontras otomatis (Hitam pada putih / Putih pada berwarna)"
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                (!settings.textColorMode || settings.textColorMode === 'category')
                  ? 'bg-purple-100 text-purple-900 border-purple-300 ring-1 ring-purple-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Auto
            </button>

            {/* Putih */}
            <button
              onClick={() => onUpdateSettings({ textColorMode: 'white', globalTextColor: '#ffffff' })}
              title="Semua teks warna putih"
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all flex items-center gap-1 ${
                settings.textColorMode === 'white'
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-purple-400'
                  : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 inline-block"></span>
              <span>Putih</span>
            </button>

            {/* Hitam */}
            <button
              onClick={() => onUpdateSettings({ textColorMode: 'black', globalTextColor: '#111827' })}
              title="Semua teks warna hitam pekat"
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all flex items-center gap-1 ${
                settings.textColorMode === 'black'
                  ? 'bg-slate-100 text-slate-900 border-slate-900 font-bold ring-2 ring-purple-400'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-black inline-block"></span>
              <span>Hitam</span>
            </button>

            {/* Kuning Farmasi */}
            <button
              onClick={() => onUpdateSettings({ textColorMode: 'yellow', globalTextColor: '#FACC15' })}
              title="Warna kuning khas apotek (sangat kontras di background ungu/merah)"
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all flex items-center gap-1 ${
                settings.textColorMode === 'yellow'
                  ? 'bg-amber-100 text-amber-950 border-amber-500 font-bold ring-2 ring-amber-400'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-amber-400 inline-block"></span>
              <span>Kuning</span>
            </button>

            {/* Custom Color Input */}
            <div className="flex items-center space-x-1 pl-1">
              <input
                type="color"
                value={settings.globalTextColor || '#ffffff'}
                onChange={(e) => {
                  onUpdateSettings({
                    textColorMode: 'custom',
                    globalTextColor: e.target.value
                  });
                }}
                title="Pilih warna font bebas"
                className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              {settings.textColorMode === 'custom' && (
                <span className="text-[10px] font-mono text-purple-700 font-bold">
                  {settings.globalTextColor.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Ukuran Font Presets & Expand Detail */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            Ukuran:
          </span>

          {FONT_SIZE_PRESETS.map((preset) => {
            const isMatch = 
              settings.fontSizeNama === preset.nama &&
              settings.fontSizeKemasan === preset.kemasan &&
              settings.fontSizeKandungan === preset.kandungan;

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  isMatch
                    ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.name}
              </button>
            );
          })}

          {/* Toggle Expand Detail Sliders */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 ml-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Detail</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expanded Detailed Sliders (Nama, Kemasan, Kandungan, Ketebalan, dsb.) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in duration-150">
          
          {/* Slider 1: Ukuran Nama Obat */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Nama Obat:</span>
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
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10 pt</span>
              <span>15 pt</span>
              <span>20 pt</span>
            </div>
          </div>

          {/* Slider 2: Ukuran Sediaan & Kemasan / Besaran Obat (disamakan dengan nama obat) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Besaran / Kemasan:</span>
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
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>8 pt</span>
              <label className="inline-flex items-center gap-1 cursor-pointer font-bold text-purple-700 select-none">
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
                  className="rounded text-purple-600 focus:ring-purple-500 w-3 h-3 cursor-pointer"
                />
                <span>Kunci sama nama</span>
              </label>
              <span>20 pt</span>
            </div>
          </div>

          {/* Slider 3: Ukuran Kandungan / Zat Aktif */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Kandungan / Zat Aktif:</span>
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
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>7 pt</span>
              <span>10.5 pt</span>
              <span>14 pt</span>
            </div>
          </div>

          {/* Extra: Ketebalan (Weight) & Format Huruf */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Ketebalan Huruf:</span>
              <select
                value={settings.fontWeight || '800'}
                onChange={(e) => onUpdateSettings({ fontWeight: e.target.value })}
                className="px-2 py-0.5 rounded border border-slate-300 bg-white font-bold text-xs"
              >
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black / Tebal Maksimal (900)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-600">Huruf Kapital (UPPERCASE):</span>
              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({
                    textTransform: settings.textTransform === 'none' ? 'uppercase' : 'none'
                  });
                }}
                className={`px-2 py-0.5 text-[11px] rounded font-bold border transition-colors ${
                  settings.textTransform !== 'none'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {settings.textTransform !== 'none' ? 'AKTIF (ABC)' : 'Asli (Abc)'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
