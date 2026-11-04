import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CategoryColorManager from './components/CategoryColorManager';
import PrintSheet from './components/PrintSheet';
import DataTable from './components/DataTable';
import PrintSettingsModal from './components/PrintSettingsModal';
import UploadModal from './components/UploadModal';
import PrintGuideModal from './components/PrintGuideModal';
import EditLabelModal from './components/EditLabelModal';
import TypographyToolbar from './components/TypographyToolbar';

import { SAMPLE_DATA, DEFAULT_CATEGORY_COLORS } from './data/sampleData';
import { THEME_PRESETS, getOptimalTextColor, getDarkerColor } from './utils/colorUtils';
import { exportItemsToExcel } from './utils/excelParser';
import { 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Filter, 
  HelpCircle,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  paperSize: 'A4',
  columns: 3,
  rows: 5,
  labelWidth: 65,  // mm (6.5 cm)
  labelHeight: 52, // mm (5.2 cm)
  pageMargin: 5,
  labelGap: 2.5,
  labelBgMode: 'colored',
  syncKemasanSize: true,
  fontSizeNama: 17,      // Ekstra Besar (17 pt)
  fontSizeKemasan: 17,   // Ekstra Besar (17 pt)
  fontSizeKandungan: 11, // Ekstra Besar (11 pt)
  fontFamily: 'Arial',   // Default: Arial
  fontWeight: '800',
  textTransform: 'uppercase',
  textColorMode: 'black',      // Default: Hitam
  globalTextColor: '#000000', // Default: #000000
  customNamaColor: '',
  customKemasanColor: '',
  customKandunganColor: '',
  borderStyle: 'solid',
  borderRadius: 0,
  showCategoryTag: false,
  showDivider: true,
  dividerStyle: 'solid',
  dividerWidth: 100,
  dividerThickness: 1.5,
  dividerOpacity: 85
};

export default function App() {
  // Main Items State (pre-populated with full Lampiran 2 dataset)
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('apotek_label_items');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return SAMPLE_DATA;
  });

  // Category Colors State
  const [categoryColors, setCategoryColors] = useState(() => {
    const saved = localStorage.getItem('apotek_label_colors');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_CATEGORY_COLORS;
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('apotek_label_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const fontFamily = (!parsed.fontFamily || parsed.fontFamily === 'Montserrat') ? 'Arial' : parsed.fontFamily;
        const textColorMode = (parsed.textColorMode === 'yellow' || parsed.textColorMode === 'custom') ? parsed.textColorMode : 'black';
        const globalTextColor = textColorMode === 'black' ? '#000000' : (parsed.globalTextColor || '#000000');
        const isOldSize = !parsed.fontSizeNama || parsed.fontSizeNama === 13;
        const fontSizeNama = isOldSize ? 17 : parsed.fontSizeNama;
        const fontSizeKandungan = isOldSize ? 11 : (parsed.fontSizeKandungan || 11);
        const syncKemasan = parsed.syncKemasanSize !== undefined ? parsed.syncKemasanSize : true;
        const fontSizeKemasan = syncKemasan ? fontSizeNama : (parsed.fontSizeKemasan || fontSizeNama);

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          fontFamily,
          textColorMode,
          globalTextColor,
          fontSizeNama,
          fontSizeKemasan,
          fontSizeKandungan,
          labelWidth: parsed.labelWidth || 65,
          labelHeight: parsed.labelHeight || 52,
          labelGap: parsed.labelGap !== undefined ? parsed.labelGap : 2.5,
          syncKemasanSize: syncKemasan,
          showDivider: parsed.showDivider !== undefined ? parsed.showDivider : true,
          dividerWidth: parsed.dividerWidth === 80 || parsed.dividerWidth === undefined ? 100 : parsed.dividerWidth
        };
      } catch {}
    }
    return DEFAULT_SETTINGS;
  });

  // Active Tab: 'preview' (lembar cetak), 'colors' (atur warna), 'table' (edit data)
  const [activeTab, setActiveTab] = useState('preview');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Sheet zoom preview scale
  const [zoomScale, setZoomScale] = useState(0.85);

  // Quick category filter for preview
  const [previewCategoryFilter, setPreviewCategoryFilter] = useState('ALL');

  // Pagination for preview sheets
  const [previewPageMode, setPreviewPageMode] = useState('all'); // 'all' or 'single'
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Extract unique categories from items
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      if (it.kategori) set.add(it.kategori.trim().toUpperCase());
    });
    return Array.from(set).sort();
  }, [items]);

  // Selected Categories to print
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const initial = new Set();
    categories.forEach(c => initial.add(c));
    return initial;
  });

  // Selected Individual Item IDs to print
  const [selectedItemIds, setSelectedItemIds] = useState(() => {
    return new Set(items.map(it => it.id));
  });

  // Update selectedCategories when categories change
  useEffect(() => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      categories.forEach(c => next.add(c));
      return next;
    });
  }, [categories]);

  // Sync missing categories into categoryColors with auto-generated distinct colors
  useEffect(() => {
    setCategoryColors(prev => {
      let changed = false;
      const updated = { ...prev };
      
      const defaultPalette = [
        '#6B2D82', '#C1121F', '#1D3557', '#2E7D32', '#C2185B', 
        '#E65100', '#D84315', '#00897B', '#5D4037', '#0277BD', 
        '#455A64', '#4527A0', '#00838F', '#558B2F', '#00695C'
      ];

      categories.forEach((cat, idx) => {
        if (!updated[cat]) {
          changed = true;
          const bg = defaultPalette[idx % defaultPalette.length];
          updated[cat] = {
            bg,
            text: getOptimalTextColor(bg),
            border: getDarkerColor(bg)
          };
        }
      });

      return changed ? updated : prev;
    });
  }, [categories]);

  // Items grouped by category
  const itemsByCategory = useMemo(() => {
    const map = {};
    items.forEach(it => {
      const cat = it.kategori || 'LAINNYA';
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    });
    return map;
  }, [items]);

  // Items filtered for printing / preview
  const printableItems = useMemo(() => {
    return items.filter(it => {
      // Must be in selected categories
      if (!selectedCategories.has(it.kategori)) return false;
      // Must be checked in item list
      if (!selectedItemIds.has(it.id)) return false;
      // If preview category filter is active (not ALL)
      if (previewCategoryFilter !== 'ALL' && it.kategori !== previewCategoryFilter) return false;
      return true;
    });
  }, [items, selectedCategories, selectedItemIds, previewCategoryFilter]);

  // Divide printable items into pages based on grid capacity
  const labelsPerPage = (settings.columns || 3) * (settings.rows || 5);
  const totalSheets = Math.ceil(printableItems.length / labelsPerPage) || 1;

  const sheetsData = useMemo(() => {
    const sheets = [];
    for (let i = 0; i < printableItems.length; i += labelsPerPage) {
      sheets.push(printableItems.slice(i, i + labelsPerPage));
    }
    return sheets.length > 0 ? sheets : [[]];
  }, [printableItems, labelsPerPage]);

  // Persist items, colors, settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('apotek_label_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('apotek_label_colors', JSON.stringify(categoryColors));
    } catch {}
  }, [categoryColors]);

  useEffect(() => {
    try {
      localStorage.setItem('apotek_label_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Handler: Update category color
  const handleUpdateCategoryColor = (category, colorConfig) => {
    setCategoryColors(prev => ({
      ...prev,
      [category]: colorConfig
    }));
  };

  // Handler: Apply Theme Preset
  const handleApplyThemePreset = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setCategoryColors(preset.colors);
      showToast(`Tema diterapkan: ${preset.name}`);
    }
  };

  // Handler: Toggle category selection
  const handleToggleCategorySelection = (cat) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(new Set(categories));
    showToast('Semua kategori terpilih untuk dicetak.');
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories(new Set());
    showToast('Semua kategori dinonaktifkan.');
  };

  // Handler: Item selection
  const handleToggleSelectItem = (id) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllItems = () => {
    setSelectedItemIds(new Set(items.map(it => it.id)));
    showToast('Semua obat dicentang.');
  };

  const handleDeselectAllItems = () => {
    setSelectedItemIds(new Set());
    showToast('Semua centang obat dibatalkan.');
  };

  // Handler: Edit item
  const handleUpdateItem = (id, newFields) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...newFields } : it));
    showToast('Data obat berhasil diperbarui.');
  };

  // Handler: Delete item
  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast('Obat berhasil dihapus.');
  };

  // Handler: Add new item
  const handleAddItem = (newItem) => {
    const id = `item-${Date.now()}`;
    const created = { id, ...newItem };
    setItems(prev => [created, ...prev]);
    setSelectedItemIds(prev => new Set(prev).add(id));
    showToast('Obat baru berhasil ditambahkan!');
  };

  // Handler: Duplicate item
  const handleDuplicateItem = (item) => {
    const id = `item-${Date.now()}`;
    const duplicated = {
      ...item,
      id,
      nama: `${item.nama} (SALINAN)`
    };
    setItems(prev => [duplicated, ...prev]);
    setSelectedItemIds(prev => new Set(prev).add(id));
    showToast(`Label ${item.nama} berhasil diduplikat.`);
  };

  // Handler: Batch fill packaging
  const handleBatchFillPackaging = (text, categoryTarget) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    setItems(prev => prev.map(it => {
      if (categoryTarget !== 'ALL' && it.kategori !== categoryTarget) {
        return it;
      }
      // If kemasan is empty or doesn't have @, append/set cleanText
      if (!it.kemasan) {
        return { ...it, kemasan: cleanText };
      }
      if (!it.kemasan.includes('@')) {
        return { ...it, kemasan: `${it.kemasan} ${cleanText}`.trim() };
      }
      return it;
    }));

    showToast(`Kemasan massal diterapkan (${cleanText})`);
  };

  // Handler: Load Lampiran 2 Demo Data
  const handleLoadDemo = () => {
    setItems(SAMPLE_DATA);
    setCategoryColors(DEFAULT_CATEGORY_COLORS);
    setSelectedCategories(new Set(categories));
    setSelectedItemIds(new Set(SAMPLE_DATA.map(it => it.id)));
    setSettings(DEFAULT_SETTINGS);
    setPreviewCategoryFilter('ALL');
    showToast('Berhasil memuat 1,118 data obat lengkap dari Lampiran 2!');
  };

  // Handler: Data loaded from Upload
  const handleDataLoaded = (newItems, mode) => {
    if (mode === 'replace') {
      setItems(newItems);
      setSelectedItemIds(new Set(newItems.map(it => it.id)));
      showToast(`Berhasil mengganti data dengan ${newItems.length} obat baru.`);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setSelectedItemIds(prev => {
        const next = new Set(prev);
        newItems.forEach(it => next.add(it.id));
        return next;
      });
      showToast(`Berhasil menambahkan ${newItems.length} obat ke daftar.`);
    }
    setActiveTab('preview');
  };

  // Handler: Export current data to Excel
  const handleExportExcel = () => {
    exportItemsToExcel(items, `label_obat_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('File Excel berhasil diunduh.');
  };

  // Print Action
  const handlePrint = () => {
    if (printableItems.length === 0) {
      alert('Tidak ada label yang dipilih untuk dicetak. Pilih minimal 1 obat/kategori terlebih dahulu.');
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white flex flex-col text-slate-800 print:min-h-0 print:m-0 print:p-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        totalItems={items.length}
        selectedCount={printableItems.length}
        categoryCount={categories.length}
        totalPages={totalSheets}
        onPrint={handlePrint}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenEditor={() => setActiveTab('table')}
        onOpenGuide={() => setIsGuideOpen(true)}
        onLoadDemo={handleLoadDemo}
        onExportExcel={handleExportExcel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 print:p-0 print:m-0 print:max-w-none print:w-full print:bg-white">
        
        {/* TAB 1: Pilihan Warna Kategori */}
        {activeTab === 'colors' && (
          <CategoryColorManager
            categories={categories}
            categoryColors={categoryColors}
            onUpdateCategoryColor={handleUpdateCategoryColor}
            onApplyThemePreset={handleApplyThemePreset}
            selectedCategories={selectedCategories}
            onToggleCategorySelection={handleToggleCategorySelection}
            onSelectAllCategories={handleSelectAllCategories}
            onDeselectAllCategories={handleDeselectAllCategories}
            itemsByCategory={itemsByCategory}
          />
        )}

        {/* TAB 2: Daftar Data Obat (Table View) */}
        {activeTab === 'table' && (
          <DataTable
            items={items}
            categories={categories}
            categoryColors={categoryColors}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
            onDuplicateItem={handleDuplicateItem}
            onBatchFillPackaging={handleBatchFillPackaging}
            selectedItemIds={selectedItemIds}
            onToggleSelectItem={handleToggleSelectItem}
            onSelectAllItems={handleSelectAllItems}
            onDeselectAllItems={handleDeselectAllItems}
          />
        )}

        {/* TAB 3: Pratinjau Lembar Cetak (Print Sheet Preview) */}
        {activeTab === 'preview' && (
          <div>
            
            {/* Quick Typography & Font Toolbar */}
            <TypographyToolbar
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
            />

            {/* Preview Toolbar (Hidden in print) */}
            <div className="no-print bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Filter By Category Dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mr-1">
                  <Filter className="w-3.5 h-3.5 text-purple-700" />
                  <span>Saring Pratinjau:</span>
                </div>
                
                <select
                  value={previewCategoryFilter}
                  onChange={(e) => {
                    setPreviewCategoryFilter(e.target.value);
                    setCurrentSheetIndex(0);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">Semua Kategori Aktif ({printableItems.length} label)</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      Hanya {c} ({(itemsByCategory[c] || []).length} label)
                    </option>
                  ))}
                </select>

                {previewCategoryFilter !== 'ALL' && (
                  <button
                    onClick={() => setPreviewCategoryFilter('ALL')}
                    className="px-2 py-1 text-xs text-purple-700 hover:text-purple-900 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {/* View Mode & Zoom Controls */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* View Mode: All Sheets vs Single Sheet */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setPreviewPageMode('all')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      previewPageMode === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua Lembar ({totalSheets})
                  </button>
                  <button
                    onClick={() => setPreviewPageMode('single')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      previewPageMode === 'single'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Per Halaman
                  </button>
                </div>

                {/* Page Navigation if in Single Sheet mode */}
                {previewPageMode === 'single' && (
                  <div className="flex items-center space-x-1 text-xs">
                    <button
                      onClick={() => setCurrentSheetIndex(p => Math.max(0, p - 1))}
                      disabled={currentSheetIndex === 0}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold px-2">
                      Hal {currentSheetIndex + 1} / {totalSheets}
                    </span>
                    <button
                      onClick={() => setCurrentSheetIndex(p => Math.min(totalSheets - 1, p + 1))}
                      disabled={currentSheetIndex >= totalSheets - 1}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                  <button
                    onClick={() => setZoomScale(z => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                    title="Perkecil Tampilan"
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono font-semibold text-[11px]">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomScale(z => Math.min(1.2, Math.round((z + 0.1) * 10) / 10))}
                    title="Perbesar Tampilan"
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Print Button */}
                <button
                  onClick={handlePrint}
                  disabled={printableItems.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>

              </div>
            </div>

            {/* Empty State warning */}
            {printableItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Tidak Ada Label yang Dipilih
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Semua kategori atau obat saat ini sedang tidak dicentang. Silakan aktifkan kategori di tab "Pilihan Warna Kategori" atau centang obat di tab "Daftar Data Obat".
                </p>
                <button
                  onClick={handleSelectAllCategories}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800"
                >
                  Aktifkan Semua Kategori
                </button>
              </div>
            ) : (
              /* Printable Sheets Rendering */
              <div className="flex flex-col items-center print:w-full print:block print:p-0 print:m-0 print:bg-white">
                
                {/* Notice banner on screen */}
                <div className="no-print w-full max-w-4xl mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <span className="p-1 rounded-lg bg-amber-200 text-amber-900 shrink-0 font-bold text-[11px] px-2">
                      TIPS CETAK
                    </span>
                    <div className="leading-relaxed">
                      <span>
                        Ukuran label <strong>6,5 cm × 5,2 cm</strong> (Grid 3×5, 15 label/lembar). Pada menu Cetak browser, wajib centang:
                      </span>
                      <span className="ml-1 font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        ☑ Grafik latar belakang (Background graphics)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsGuideOpen(true)}
                    className="text-xs font-bold text-purple-800 hover:text-purple-950 underline shrink-0 whitespace-nowrap self-end sm:self-center"
                  >
                    Panduan Lengkap Cetak
                  </button>
                </div>

                {/* Sheets Container */}
                <div className="w-full flex flex-col items-center print:block print:w-full print:p-0 print:m-0 print:bg-white">
                  {sheetsData.map((sheetItems, pageIdx) => {
                    const isCurrent = pageIdx === currentSheetIndex;
                    const isHiddenOnScreen = previewPageMode === 'single' && !isCurrent;

                    return (
                      <div
                        key={pageIdx}
                        className={isHiddenOnScreen ? 'hidden print:block print:w-full print:bg-white' : 'w-full flex flex-col items-center print:block print:w-full print:bg-white'}
                      >
                        <PrintSheet
                          pageNumber={pageIdx + 1}
                          totalPages={totalSheets}
                          items={sheetItems}
                          categoryColors={categoryColors}
                          settings={settings}
                          onEditItem={(item) => setEditingItem(item)}
                          onDuplicateItem={handleDuplicateItem}
                          zoomScale={zoomScale}
                        />
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer (Hidden in print) */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Apotek Label Master • Generator Label Kotak Obat Farmasi</p>
          <p className="text-[11px] text-slate-400">
            Dibuat untuk mempermudah identifikasi kotak obat dengan kode warna kategori
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
      />

      <PrintSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
        onResetSettings={() => {
          setSettings(DEFAULT_SETTINGS);
          showToast('Pengaturan dikembalikan ke standar awal.');
        }}
      />

      <PrintGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <EditLabelModal
        isOpen={Boolean(editingItem)}
        item={editingItem}
        categories={categories}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdateItem}
      />

    </div>
  );
}
