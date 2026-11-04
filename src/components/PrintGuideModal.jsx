import React from 'react';
import { HelpCircle, X, CheckCircle, Printer, Palette, Sliders, AlertTriangle } from 'lucide-react';

export default function PrintGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-purple-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-200 text-purple-800">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Panduan Mencetak Label Berwarna (Print / PDF)
              </h3>
              <p className="text-xs text-slate-600">
                Cara memastikan warna label kotak obat tercetak tajam dan presisi.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          
          {/* CRITICAL NOTE: Background Graphics */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>PENTING: Aktifkan "Grafik Latar Belakang" (Background Graphics)</span>
            </div>
            <p className="text-xs">
              Secara default, browser mematikan warna background saat mencetak kertas. Agar warna ungu/merah/kuning label Anda tercetak, centang opsi:
            </p>
            <p className="mt-2 font-mono font-bold bg-white px-2.5 py-1.5 rounded-lg border border-amber-300 text-slate-800 text-center">
              Setelan Lainnya (More settings) → ☑ Grafik latar belakang (Background graphics)
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-bold text-slate-900">Klik Tombol "CETAK LABEL"</p>
                <p className="text-slate-500 text-[11px]">
                  Atau tekan shortcut keyboard <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-mono">Ctrl + P</kbd> pada Windows.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-bold text-slate-900">Pilih Tujuan (Destination)</p>
                <p className="text-slate-500 text-[11px]">
                  Pilih printer fisik Anda (Epson, Canon, HP, Brother) atau pilih <strong>"Save as PDF" (Simpan sebagai PDF)</strong> untuk menyimpan arsip dokumen siap cetak.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-bold text-slate-900">Atur Margin & Skala</p>
                <ul className="list-disc pl-4 text-slate-600 text-[11px] mt-0.5 space-y-0.5">
                  <li><strong>Margin:</strong> Pilih <strong>"Default"</strong> atau <strong>"None"</strong></li>
                  <li><strong>Skala (Scale):</strong> Pilih <strong>100% (Default)</strong> agar ukuran grid 3×5 pas tanpa terpotong</li>
                  <li><strong>Ukuran Kertas:</strong> Sesuaikan dengan kertas Anda (A4 atau F4/Folio)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </div>
              <div>
                <p className="font-bold text-slate-900">Rekomendasi Kertas Cetak</p>
                <p className="text-slate-500 text-[11px]">
                  Untuk label kotak obat, disarankan memakai <strong>Kertas Stiker Glossy / Matte A4</strong> atau <strong>Kertas HVS Tebal 80-100 gsm</strong> agar kokoh dan mudah ditempelkan di kotak obat apotek.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm"
          >
            Mengerti, Siap Mencetak
          </button>
        </div>

      </div>
    </div>
  );
}
