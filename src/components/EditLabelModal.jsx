import React, { useState, useEffect } from 'react';
import { Edit2, X, Check } from 'lucide-react';

export default function EditLabelModal({
  isOpen,
  item,
  categories,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    nama: '',
    kemasan: '',
    kategori: '',
    kandungan: ''
  });

  useEffect(() => {
    if (item) {
      setForm({
        nama: item.nama || '',
        kemasan: item.kemasan || '',
        kategori: item.kategori || categories[0] || 'GENERIK',
        kandungan: item.kandungan || ''
      });
    }
  }, [item, categories]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Edit Teks Label Obat
              </h3>
              <p className="text-[11px] text-slate-500">
                Perubahan akan langsung terlihat di lembar cetak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Baris 1: Nama Obat & Dosis
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold uppercase focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Baris 2: Sediaan & Kemasan (@)
            </label>
            <input
              type="text"
              value={form.kemasan}
              placeholder="Contoh: TAB @30 atau KAP @100"
              onChange={(e) => setForm({ ...form, kemasan: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold uppercase focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Kategori Obat
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium uppercase focus:ring-2 focus:ring-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Baris 3: Kandungan / Zat Aktif
            </label>
            <textarea
              rows={2}
              value={form.kandungan}
              placeholder="Contoh: DESLORATADIN 5MG"
              onChange={(e) => setForm({ ...form, kandungan: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium uppercase focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
