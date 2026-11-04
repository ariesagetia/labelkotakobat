import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  CheckSquare, 
  Square, 
  Filter, 
  Copy,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DataTable({
  items,
  categories,
  categoryColors,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onDuplicateItem,
  onBatchFillPackaging,
  selectedItemIds,
  onToggleSelectItem,
  onSelectAllItems,
  onDeselectAllItems
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nama: '', kemasan: '', kategori: '', kandungan: '' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // New item modal state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({
    nama: '',
    kemasan: 'TAB @100',
    kategori: categories[0] || 'GENERIK',
    kandungan: ''
  });

  // Batch fill modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchKemasanText, setBatchKemasanText] = useState('@100');

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = 
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.kemasan && item.kemasan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.kandungan && item.kandungan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.kategori && item.kategori.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'ALL' || item.kategori === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handle start edit
  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      nama: item.nama,
      kemasan: item.kemasan || '',
      kategori: item.kategori,
      kandungan: item.kandungan || ''
    });
  };

  // Handle save edit
  const handleSaveEdit = (id) => {
    onUpdateItem(id, editForm);
    setEditingId(null);
  };

  // Handle save new
  const handleSaveNew = (e) => {
    e.preventDefault();
    if (!newItem.nama.trim()) return;
    onAddItem(newItem);
    setNewItem({
      nama: '',
      kemasan: 'TAB @100',
      kategori: categories[0] || 'GENERIK',
      kandungan: ''
    });
    setIsAddingNew(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      
      {/* Top Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Daftar Data Obat ({items.length} Total Obat)
          </h2>
          <p className="text-xs text-slate-500">
            Edit nama obat, kemasan/isi (@30, @100), kategori, dan kandungan langsung di sini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add New Medicine */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Obat Baru</span>
          </button>

          {/* Batch Fill Packaging */}
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
            title="Isi kemasan default (contoh @100) untuk obat yang belum memiliki kemasan"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Isi Kemasan Massal</span>
          </button>

          {/* Select / Deselect All */}
          <button
            onClick={onSelectAllItems}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Centang Semua</span>
          </button>
          <button
            onClick={onDeselectAllItems}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Square className="w-3.5 h-3.5 text-slate-400" />
            <span>Batal Semua</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 my-4">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari obat berdasarkan nama, kemasan, atau zat aktif..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">Semua Kategori ({categories.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Counter */}
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl whitespace-nowrap">
          {selectedItemIds.size} obat terpilih untuk dicetak
        </div>

      </div>

      {/* Modal Add New Medicine */}
      {isAddingNew && (
        <div className="mb-4 p-4 rounded-xl border border-purple-200 bg-purple-50/50">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-purple-700" /> Tambah Obat Baru ke Daftar Label
          </h3>
          <form onSubmit={handleSaveNew} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama & Dosis Obat</label>
              <input
                type="text"
                placeholder="Contoh: PARACETAMOL 500 MG"
                value={newItem.nama}
                onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white uppercase font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bentuk & Kemasan (@)</label>
              <input
                type="text"
                placeholder="Contoh: TAB @100 atau KAP @30"
                value={newItem.kemasan}
                onChange={(e) => setNewItem({ ...newItem, kemasan: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white uppercase"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kategori</label>
              <select
                value={newItem.kategori}
                onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium uppercase"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kandungan / Zat Aktif</label>
              <input
                type="text"
                placeholder="Contoh: PARACETAMOL 500MG"
                value={newItem.kandungan}
                onChange={(e) => setNewItem({ ...newItem, kandungan: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white uppercase"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800"
              >
                Simpan & Tambah
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batch Packaging Modal */}
      {isBatchModalOpen && (
        <div className="mb-4 p-4 rounded-xl border border-amber-300 bg-amber-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" /> Isi / Tambahkan Kemasan Massal
            </h4>
            <button
              onClick={() => setIsBatchModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              ✕ Tutup
            </button>
          </div>
          <p className="text-xs text-amber-800 mb-3">
            Otomatis tambahkan teks kemasan (seperti <code className="bg-amber-100 px-1 py-0.5 rounded">@100</code> atau <code className="bg-amber-100 px-1 py-0.5 rounded">@30</code>) ke item obat yang kemasannya masih belum ada info <code className="bg-amber-100 px-1 py-0.5 rounded">@...</code>.
          </p>
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={batchKemasanText}
              onChange={(e) => setBatchKemasanText(e.target.value)}
              placeholder="Contoh: @100"
              className="px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-white font-bold"
            />
            <button
              onClick={() => {
                onBatchFillPackaging(batchKemasanText, selectedCategory);
                setIsBatchModalOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-700 text-white hover:bg-amber-800"
            >
              Terapkan ke {selectedCategory === 'ALL' ? 'Semua Obat' : `Kategori ${selectedCategory}`}
            </button>
          </div>
        </div>
      )}

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
            <tr>
              <th className="p-3 w-10 text-center">Cetak</th>
              <th className="p-3 w-12 text-center">No</th>
              <th className="p-3">Nama Obat</th>
              <th className="p-3 w-36">Bentuk & Kemasan</th>
              <th className="p-3 w-32">Kategori</th>
              <th className="p-3">Kandungan / Zat Aktif</th>
              <th className="p-3 w-28 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  Tidak ada data obat yang sesuai dengan pencarian atau filter kategori.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, idx) => {
                const isSelected = selectedItemIds.has(item.id);
                const isEditing = editingId === item.id;
                const catColor = categoryColors[item.kategori] || { bg: '#6B2D82', text: '#ffffff' };
                const rowNumber = (currentPage - 1) * pageSize + idx + 1;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      !isSelected ? 'opacity-40 bg-slate-50/40' : ''
                    }`}
                  >
                    {/* Checkbox Cetak */}
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectItem(item.id)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                      />
                    </td>

                    {/* Row Number */}
                    <td className="p-3 text-center text-slate-400 font-mono text-[11px]">
                      {rowNumber}
                    </td>

                    {/* Nama Obat */}
                    <td className="p-3 font-bold text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.nama}
                          onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                          className="w-full px-2 py-1 border border-purple-400 rounded uppercase font-bold text-xs"
                          autoFocus
                        />
                      ) : (
                        <span className="uppercase">{item.nama}</span>
                      )}
                    </td>

                    {/* Bentuk & Kemasan */}
                    <td className="p-3 font-semibold text-slate-800">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.kemasan}
                          onChange={(e) => setEditForm({ ...editForm, kemasan: e.target.value })}
                          className="w-full px-2 py-1 border border-purple-400 rounded uppercase text-xs"
                        />
                      ) : (
                        <span className="uppercase font-semibold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {item.kemasan || '-'}
                        </span>
                      )}
                    </td>

                    {/* Kategori Badge */}
                    <td className="p-3">
                      {isEditing ? (
                        <select
                          value={editForm.kategori}
                          onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value })}
                          className="w-full px-2 py-1 border border-purple-400 rounded uppercase text-xs"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          style={{ backgroundColor: catColor.bg, color: catColor.text }}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-2xs inline-block"
                        >
                          {item.kategori}
                        </span>
                      )}
                    </td>

                    {/* Kandungan */}
                    <td className="p-3 text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.kandungan}
                          onChange={(e) => setEditForm({ ...editForm, kandungan: e.target.value })}
                          className="w-full px-2 py-1 border border-purple-400 rounded uppercase text-xs"
                        />
                      ) : (
                        <span className="uppercase text-[11px]">{item.kandungan || '-'}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50"
                            title="Simpan Perubahan"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                            title="Batal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1 text-slate-500 hover:text-purple-600 rounded hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateItem(item)}
                            className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                            title="Duplikat"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Menampilkan baris <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredItems.length)}</strong> dari {filteredItems.length} obat
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
            Hal {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
