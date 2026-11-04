import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { PHARMACY_PALETTES, THEME_PRESETS, getOptimalTextColor, getDarkerColor } from '../utils/colorUtils';

export default function CategoryColorManager({
  categories,
  categoryColors,
  onUpdateCategoryColor,
  onApplyThemePreset,
  selectedCategories,
  onToggleCategorySelection,
  onSelectAllCategories,
  onDeselectAllCategories,
  itemsByCategory
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'selected', 'unselected'

  // Filter categories by search term
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.toLowerCase().includes(searchTerm.toLowerCase());
    const isSelected = selectedCategories.has(cat);
    if (filterMode === 'selected') return matchesSearch && isSelected;
    if (filterMode === 'unselected') return matchesSearch && !isSelected;
    return matchesSearch;
  });

  const selectedCount = categories.filter(c => selectedCategories.has(c)).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pilihan Warna & Kategori Label Obat
              </h2>
              <p className="text-xs text-slate-500">
                Pilih warna berbeda untuk setiap kategori obat. Anda juga dapat memilih kategori mana yang ingin dicetak.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tema Siap Pakai:
          </span>
          <button
            onClick={() => onApplyThemePreset('lampiran1')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            Ungu Lampiran 1
          </button>
          <button
            onClick={() => onApplyThemePreset('pastel')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-colors"
          >
            Pastel Farmasi
          </button>
          <button
            onClick={() => onApplyThemePreset('boldVibrant')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            Kontras Tinggi
          </button>
        </div>
      </div>

      {/* Filter and Selection Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kategori (e.g. ALERGI, GENERIK)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Selection Status & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Terpilih untuk Dicetak: <strong className="text-purple-700">{selectedCount}</strong> dari {categories.length} Kategori
          </div>

          <button
            onClick={onSelectAllCategories}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Semua</span>
          </button>

          <button
            onClick={onDeselectAllCategories}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Square className="w-3.5 h-3.5 text-slate-400" />
            <span>Batal Semua</span>
          </button>
        </div>
      </div>

      {/* Category List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredCategories.map((category) => {
          const config = categoryColors[category] || { bg: '#6B2D82', text: '#ffffff', border: '#521d66' };
          const isSelected = selectedCategories.has(category);
          const itemCount = (itemsByCategory[category] || []).length;
          const sampleItem = (itemsByCategory[category] || [])[0];

          return (
            <div
              key={category}
              className={`rounded-xl border transition-all duration-150 p-4 ${
                isSelected
                  ? 'border-purple-300 bg-white shadow-sm ring-1 ring-purple-100'
                  : 'border-slate-200 bg-slate-50/70 opacity-60'
              }`}
            >
              {/* Category Header with Checkbox */}
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleCategorySelection(category)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 tracking-tight">
                      {category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {itemCount} obat
                    </span>
                  </div>
                </label>

                {/* Status Indicator */}
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-slate-200 text-slate-500'
                }`}>
                  {isSelected ? 'Aktif Dicetak' : 'Dilewati'}
                </span>
              </div>

              {/* Color Customization Row */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Warna Background:</span>
                  
                  {/* Color Picker with Hex */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.bg}
                      onChange={(e) => {
                        const newBg = e.target.value;
                        const autoText = getOptimalTextColor(newBg);
                        onUpdateCategoryColor(category, {
                          bg: newBg,
                          text: config.customText ? config.text : autoText,
                          border: getDarkerColor(newBg)
                        });
                      }}
                      className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                      title="Klik untuk memilih warna bebas"
                    />
                    <input
                      type="text"
                      value={config.bg.toUpperCase()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith('#')) val = '#' + val;
                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                          onUpdateCategoryColor(category, {
                            bg: val,
                            text: config.customText ? config.text : getOptimalTextColor(val),
                            border: getDarkerColor(val)
                          });
                        }
                      }}
                      className="w-20 px-2 py-1 text-xs font-mono rounded-md border border-slate-300 uppercase bg-white text-slate-700 text-center"
                    />
                  </div>
                </div>

                {/* Quick Swatches Palette */}
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500 w-full mb-0.5">Pilihan Cepat Warna Farmasi:</span>
                  {PHARMACY_PALETTES.slice(0, 10).map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => {
                        onUpdateCategoryColor(category, {
                          bg: swatch.hex,
                          text: getOptimalTextColor(swatch.hex),
                          border: getDarkerColor(swatch.hex)
                        });
                      }}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                        config.bg.toLowerCase() === swatch.hex.toLowerCase()
                          ? 'ring-2 ring-purple-600 ring-offset-1 border-white'
                          : 'border-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Text Color Toggle */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-600 font-medium text-[11px]">Warna Teks:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCategoryColor(category, {
                          ...config,
                          text: '#ffffff',
                          customText: true
                        });
                      }}
                      className={`px-2 py-0.5 text-[11px] rounded font-semibold border ${
                        config.text === '#ffffff'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Putih
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCategoryColor(category, {
                          ...config,
                          text: '#111827',
                          customText: true
                        });
                      }}
                      className={`px-2 py-0.5 text-[11px] rounded font-semibold border ${
                        config.text === '#111827'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Hitam
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCategoryColor(category, {
                          ...config,
                          text: getOptimalTextColor(config.bg),
                          customText: false
                        });
                      }}
                      title="Otomatis pilih warna paling kontras (WCAG)"
                      className={`px-2 py-0.5 text-[11px] rounded font-medium border ${
                        !config.customText
                          ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Auto
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Mini Preview Box */}
              <div className="mt-2">
                <span className="text-[10px] font-medium text-slate-400 block mb-1">
                  Pratinjau Hasil Label:
                </span>
                <div
                  style={{
                    backgroundColor: config.bg,
                    color: config.text,
                    borderColor: config.border || '#ffffff'
                  }}
                  className="rounded-lg text-center border shadow-xs flex flex-col justify-between items-center min-h-[72px] overflow-hidden"
                >
                  <div className="w-full flex-1 flex flex-col justify-center items-center px-2 py-1.5">
                    <div className="font-extrabold text-xs uppercase tracking-tight leading-tight">
                      {sampleItem ? sampleItem.nama : `${category} MEDICINE`}
                    </div>
                    <div className="font-bold text-[11px] uppercase opacity-95 mt-0.5">
                      {sampleItem && sampleItem.kemasan ? sampleItem.kemasan : 'TAB @100'}
                    </div>
                  </div>
                  {/* Garis Pemisah Penuh Ujung ke Ujung */}
                  <div
                    style={{
                      borderTopColor: config.text,
                      opacity: 0.85
                    }}
                    className="w-full border-t"
                  />
                  <div className="w-full flex-1 flex flex-col justify-center items-center px-2 py-1">
                    <div className="text-[9px] uppercase tracking-tighter opacity-90 leading-none line-clamp-1">
                      {sampleItem && sampleItem.kandungan ? sampleItem.kandungan : 'ACTIVE INGREDIENT'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
