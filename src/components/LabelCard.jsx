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

  // 4. Sizing from user settings & smart scaling for long medicine names
  const nameSize = settings?.fontSizeNama || 17; // pt (default Ekstra Besar 17 pt)
  const baseKemasanSize = (settings?.syncKemasanSize !== false) 
    ? nameSize 
    : (settings?.fontSizeKemasan || nameSize); // pt
  const baseKandunganSize = settings?.fontSizeKandungan || 11; // pt (default Ekstra Besar 11 pt)

  // Smart scaling for long names so they never overflow, break awkwardly, or push the divider down
  const nameText = (item.nama || '').trim();
  const kemasanText = (item.kemasan || '').trim();
  const totalTopLength = nameText.length + (kemasanText ? kemasanText.length + 3 : 0);
  const longestWord = nameText.split(/\s+/).reduce((max, w) => Math.max(max, w.length), 0);

  let effectiveNameSize = nameSize;
  if (totalTopLength > 30 || longestWord > 12) {
    effectiveNameSize = Math.min(nameSize, 11.5);
  } else if (totalTopLength > 22 || longestWord > 10) {
    effectiveNameSize = Math.min(nameSize, 13.5);
  } else if (totalTopLength > 16 || longestWord > 8) {
    effectiveNameSize = Math.min(nameSize, 15);
  }

  const effectiveKemasanSize = (settings?.syncKemasanSize !== false)
    ? effectiveNameSize
    : Math.min(baseKemasanSize, effectiveNameSize);

  // Smart scaling for kandungan
  const kandunganText = (item.kandungan || '').trim();
  let effectiveKandunganSize = baseKandunganSize;
  if (kandunganText.length > 45) {
    effectiveKandunganSize = Math.min(baseKandunganSize, 8.5);
  } else if (kandunganText.length > 30) {
    effectiveKandunganSize = Math.min(baseKandunganSize, 9.5);
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
        
        {/* Top Half: Exactly 50% height, locked with min-h-0 and max-h-[50%] so it CANNOT push the divider down */}
        <div 
          style={{ height: '50%', maxHeight: '50%' }}
          className="w-full flex-1 min-h-0 flex flex-col justify-center items-center px-2 py-1 overflow-hidden box-border"
        >
          {/* Line 1: Nama Obat + Kekuatan / Dosis */}
          <div
            style={{ 
              fontSize: `${effectiveNameSize}pt`, 
              lineHeight: '1.15',
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
                lineHeight: '1.15',
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

        {/* Bottom Half: Exactly 50% height, locked with min-h-0 and max-h-[50%] */}
        <div 
          style={{ height: '50%', maxHeight: '50%' }}
          className="w-full flex-1 min-h-0 flex flex-col justify-center items-center px-2 py-1 overflow-hidden box-border"
        >
          {hasKandungan && (
            <div
              style={{ 
                fontSize: `${effectiveKandunganSize}pt`, 
                lineHeight: '1.15',
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
