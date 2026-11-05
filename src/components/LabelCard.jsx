import React from 'react';
import { Edit2, Copy } from 'lucide-react';
import { AVAILABLE_FONTS } from '../utils/fontConstants';

export default function LabelCard({
  item,
  colorConfig,
  settings,
  onEdit,
  onDuplicate,
  isInteractive = true
}) {
  const isWhiteBg = settings?.labelBgMode === 'white';
  const categoryColor = colorConfig?.bg || '#6B2D82';

  // 1. Resolve Background & Border Color
  const bg = isWhiteBg ? '#ffffff' : categoryColor;
  const border = isWhiteBg 
    ? categoryColor // Border keeps category color so user can easily identify categories!
    : (colorConfig?.border || '#521d66');

  // 2. Resolve Text Color
  let resolvedTextColor = isWhiteBg ? '#000000' : (colorConfig?.text || '#000000');
  if (settings?.textColorMode === 'white') {
    resolvedTextColor = isWhiteBg ? '#000000' : '#ffffff';
  } else if (settings?.textColorMode === 'black') {
    resolvedTextColor = settings?.globalTextColor || '#000000';
  } else if (settings?.textColorMode === 'yellow') {
    resolvedTextColor = isWhiteBg ? '#B45309' : '#FACC15';
  } else if (settings?.textColorMode === 'custom' && settings?.globalTextColor) {
    resolvedTextColor = settings.globalTextColor;
  }

  // Section specific colors (optional overrides)
  const namaColor = settings?.customNamaColor || resolvedTextColor;
  const kemasanColor = settings?.customKemasanColor || resolvedTextColor;
  const kandunganColor = settings?.customKandunganColor || resolvedTextColor;

  // 3. Resolve Font Family & Style
  const fontObj = AVAILABLE_FONTS.find(f => f.id === settings?.fontFamily) || AVAILABLE_FONTS.find(f => f.id === 'Arial') || AVAILABLE_FONTS[0];
  const fontFamilyCss = fontObj.family;
  const fontWeight = settings?.fontWeight || '800';
  const textTransform = settings?.textTransform || 'uppercase';

  // 4. Sizing from user settings: default Ekstra Besar (17 pt)
  const nameSize = settings?.fontSizeNama || 17; // pt (default 17 pt)
  const baseKemasanSize = (settings?.syncKemasanSize !== false) 
    ? nameSize 
    : (settings?.fontSizeKemasan || nameSize); // pt
  const baseKandunganSize = settings?.fontSizeKandungan || 11; // pt (default 11 pt)

  // Hitung perkiraan baris hanya untuk nama yang mepet batas kotak
  const nameText = (item.nama || '').trim();
  const kemasanText = (item.kemasan || '').trim();
  
  // Hitung baris teks jika dirender pada ukuran penuh (nameSize)
  // Lebar cetak efektif sekitar 205px. Rata-rata lebar huruf Arial bold ~ (nameSize * 0.72) px
  const maxCharsPerLine = Math.floor(205 / (nameSize * 0.72));
  const words = nameText.split(/\s+/);
  let estimatedLines = 0;
  let curLineLen = 0;
  for (const w of words) {
    if (curLineLen === 0) {
      curLineLen = w.length;
    } else if (curLineLen + 1 + w.length <= maxCharsPerLine) {
      curLineLen += 1 + w.length;
    } else {
      estimatedLines++;
      curLineLen = w.length;
    }
  }
  if (curLineLen > 0) estimatedLines++;
  if (kemasanText) estimatedLines++;

  // HANYA jika teks menghasilkan 4 baris ke atas (mepet kotak), baru disesuaikan sedikit (14.5 pt)
  // Semua obat normal (1-3 baris, ~92% obat) TETAP 100% ukuran penuh 17 pt!
  let effectiveNameSize = nameSize;
  if (estimatedLines >= 5) {
    effectiveNameSize = Math.max(nameSize - 3.5, 13.5);
  } else if (estimatedLines === 4) {
    // Seperti METHYL PREDNISOLONE 4/8 MG TAB -> hanya turun sedikit ke 14.5 pt agar tidak mepet batas
    effectiveNameSize = Math.max(nameSize - 2.5, 14.5);
  } else {
    // 1 s/d 3 baris: ALLERON, GABAPENTIN, DEXKETOPROFEN, EPERISONE-HCL, dll -> TETAP 17 PT PENUH!
    effectiveNameSize = nameSize;
  }

  const effectiveKemasanSize = (settings?.syncKemasanSize !== false)
    ? effectiveNameSize
    : (settings?.fontSizeKemasan || effectiveNameSize);

  // Kandungan obat: tetap ukuran standar (11 pt), hanya disesuaikan jika teks ekstra panjang
  const kandunganText = (item.kandungan || '').trim();
  let effectiveKandunganSize = baseKandunganSize;
  if (kandunganText.length > 55) {
    effectiveKandunganSize = Math.max(baseKandunganSize - 2, 9.5);
  }

  const borderStyle = settings?.borderStyle || 'solid'; // 'solid', 'dashed', 'dotted', 'none'
  const borderRadius = settings?.borderRadius !== undefined ? settings.borderRadius : 0; // px
  const showCategoryTag = settings?.showCategoryTag || false;

  // Divider settings (garis pemisah penuh antara item dan kandungan)
  const showDivider = settings?.showDivider !== undefined ? settings.showDivider : true;
  const dividerStyle = settings?.dividerStyle || 'solid';
  const dividerWidth = settings?.dividerWidth !== undefined ? settings.dividerWidth : 100; // % (default 100% penuh)
  const dividerThickness = settings?.dividerThickness || 1.5; // px
  const dividerOpacity = (settings?.dividerOpacity !== undefined ? settings.dividerOpacity : 85) / 100;
  const dividerColor = isWhiteBg ? categoryColor : resolvedTextColor;

  const hasKandungan = Boolean(item.kandungan && item.kandungan.trim());

  return (
    <div
      style={{
        backgroundColor: bg,
        color: resolvedTextColor,
        fontFamily: fontFamilyCss,
        borderColor: borderStyle === 'none' ? 'transparent' : border,
        borderWidth: borderStyle === 'none' ? '0px' : (isWhiteBg ? '2px' : '1.5px'),
        borderStyle: borderStyle === 'none' ? 'none' : borderStyle,
        borderRadius: `${borderRadius}px`,
        // Ensure background colors and borders print in all engines
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
      className={`relative w-full h-full flex flex-col justify-between items-center text-center box-border select-none group transition-shadow overflow-hidden ${
        isWhiteBg ? 'bg-white' : ''
      }`}
    >
      {/* Optional Interactive Overlay for screen preview */}
      {isInteractive && (
        <div className="no-print absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-black/40 backdrop-blur-xs p-1 rounded-md z-10">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              title="Edit teks label ini"
              className="p-1 text-white hover:text-purple-300 rounded hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(item);
              }}
              title="Duplikat label ini"
              className="p-1 text-white hover:text-purple-300 rounded hover:bg-white/20 transition-colors"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Optional Category Tag */}
      {showCategoryTag && (
        <div
          style={{
            color: isWhiteBg ? categoryColor : undefined,
            backgroundColor: isWhiteBg ? `${categoryColor}15` : undefined
          }}
          className="text-[8px] font-black uppercase tracking-wider opacity-85 pt-1 px-1.5 rounded mt-0.5 shrink-0"
        >
          {item.kategori}
        </div>
      )}

      {/* Main Content Area: Locked into exactly 2 equal halves (50% Top, 50% Bottom) */}
      <div className="w-full h-full flex flex-col justify-between items-center relative overflow-hidden box-border">
        
        {/* Top Half: Exactly 50% height with safe margins so text NEVER touches top border or middle divider */}
        <div 
          style={{ 
            height: '50%', 
            maxHeight: '50%',
            padding: '5px 8px 4px 8px' // Safe buffer from top border and middle divider
          }}
          className="w-full flex-1 min-h-0 flex flex-col justify-center items-center overflow-hidden box-border"
        >
          {/* Line 1: Nama Obat + Kekuatan / Dosis */}
          <div
            style={{ 
              fontSize: `${effectiveNameSize}pt`, 
              lineHeight: '1.14',
              color: namaColor,
              fontWeight: fontWeight,
              textTransform: textTransform
            }}
            className="tracking-tight text-center w-full px-1 break-words"
          >
            {item.nama}
          </div>

          {/* Line 2: Sediaan & Kemasan / Besaran Obat (e.g. TAB @30, KAP @100, 120 ML) */}
          {item.kemasan && (
            <div
              style={{ 
                fontSize: `${effectiveKemasanSize}pt`, 
                lineHeight: '1.14',
                color: kemasanColor,
                fontWeight: fontWeight,
                textTransform: textTransform
              }}
              className="tracking-tight text-center w-full mt-0.5 px-1 break-words opacity-95"
            >
              {item.kemasan}
            </div>
          )}
        </div>

        {/* Center Divider: Locked at exactly 50% vertical center */}
        {showDivider && (
          <div
            style={{
              width: `${dividerWidth}%`,
              borderTopWidth: `${dividerThickness}px`,
              borderTopStyle: dividerStyle,
              borderTopColor: dividerColor,
              opacity: dividerOpacity
            }}
            className="w-full shrink-0 mx-auto"
          />
        )}

        {/* Bottom Half: Exactly 50% height with safe margins */}
        <div 
          style={{ 
            height: '50%', 
            maxHeight: '50%',
            padding: '4px 8px 5px 8px' // Safe buffer from middle divider and bottom border
          }}
          className="w-full flex-1 min-h-0 flex flex-col justify-center items-center overflow-hidden box-border"
        >
          {hasKandungan && (
            <div
              style={{ 
                fontSize: `${effectiveKandunganSize}pt`, 
                lineHeight: '1.14',
                color: kandunganColor,
                fontWeight: fontWeight === '900' ? '700' : (fontWeight === '800' ? '600' : '500'),
                textTransform: textTransform
              }}
              className="tracking-tighter text-center w-full px-1 break-words opacity-90 line-clamp-3"
            >
              {item.kandungan}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
