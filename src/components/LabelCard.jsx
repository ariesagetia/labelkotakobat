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
  let resolvedTextColor = isWhiteBg ? '#111827' : (colorConfig?.text || '#ffffff');
  if (settings?.textColorMode === 'white') {
    resolvedTextColor = isWhiteBg ? '#111827' : '#ffffff';
  } else if (settings?.textColorMode === 'black') {
    resolvedTextColor = '#111827';
  } else if (settings?.textColorMode === 'yellow') {
    resolvedTextColor = isWhiteBg ? '#B45309' : '#FACC15';
  } else if (settings?.textColorMode === 'custom' && settings?.globalTextColor) {
    resolvedTextColor = settings.globalTextColor;
  }

  // Section specific colors (optional overrides)
  const namaColor = settings?.customNamaColor || (isWhiteBg ? '#0f172a' : resolvedTextColor);
  const kemasanColor = settings?.customKemasanColor || (isWhiteBg ? '#334155' : resolvedTextColor);
  const kandunganColor = settings?.customKandunganColor || (isWhiteBg ? '#475569' : resolvedTextColor);

  // 3. Resolve Font Family & Style
  const fontObj = AVAILABLE_FONTS.find(f => f.id === settings?.fontFamily) || AVAILABLE_FONTS[0];
  const fontFamilyCss = fontObj.family;
  const fontWeight = settings?.fontWeight || '800';
  const textTransform = settings?.textTransform || 'uppercase';

  // 4. Sizing from user settings
  const nameSize = settings?.fontSizeNama || 13; // pt
  const kemasanSize = settings?.fontSizeKemasan || 11; // pt
  const kandunganSize = settings?.fontSizeKandungan || 9; // pt
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
          className="text-[8px] font-black uppercase tracking-wider opacity-85 pt-1 px-1.5 rounded mt-0.5"
        >
          {item.kategori}
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col justify-between items-center">
        
        {/* Top Section: Nama Obat + Kekuatan / Dosis & Kemasan */}
        <div className="w-full flex-1 flex flex-col justify-center items-center px-2 py-1.5">
          {/* Line 1: Nama Obat + Kekuatan / Dosis */}
          <div
            style={{ 
              fontSize: `${nameSize}pt`, 
              lineHeight: '1.2',
              color: namaColor,
              fontWeight: fontWeight,
              textTransform: textTransform
            }}
            className="tracking-tight text-center w-full px-1 break-words"
          >
            {item.nama}
          </div>

          {/* Line 2: Sediaan & Kemasan (e.g. TAB @30, KAP @100) */}
          {item.kemasan && (
            <div
              style={{ 
                fontSize: `${kemasanSize}pt`, 
                lineHeight: '1.25',
                color: kemasanColor,
                fontWeight: fontWeight === '900' ? '800' : '700',
                textTransform: textTransform
              }}
              className="tracking-normal text-center w-full mt-1 px-1 break-words opacity-95"
            >
              {item.kemasan}
            </div>
          )}
        </div>

        {/* Garis Pemisah Penuh dari Kanan ke Kiri Sepanjang Lebar Kotak */}
        {hasKandungan && showDivider && (
          <div
            style={{
              width: `${dividerWidth}%`,
              borderTopWidth: `${dividerThickness}px`,
              borderTopStyle: dividerStyle,
              borderTopColor: dividerColor,
              opacity: dividerOpacity
            }}
            className="shrink-0 mx-auto"
          />
        )}

        {/* Bottom Section: Kandungan / Komposisi Aktif */}
        {hasKandungan && (
          <div className="w-full flex-1 flex flex-col justify-center items-center px-2 py-1.5">
            <div
              style={{ 
                fontSize: `${kandunganSize}pt`, 
                lineHeight: '1.2',
                color: kandunganColor,
                fontWeight: fontWeight === '900' ? '700' : (fontWeight === '800' ? '600' : '500'),
                textTransform: textTransform
              }}
              className="tracking-tighter text-center w-full px-1 break-words opacity-90 line-clamp-3"
            >
              {item.kandungan}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
