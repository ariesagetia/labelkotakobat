import React from 'react';
import LabelCard from './LabelCard';

export default function PrintSheet({
  pageNumber,
  totalPages,
  items,
  categoryColors,
  settings,
  onEditItem,
  onDuplicateItem,
  zoomScale = 1
}) {
  const paper = settings?.paperSize || 'A4';
  const cols = settings?.columns || 3;
  const rows = settings?.rows || 5;
  const marginMm = settings?.pageMargin || 8; // mm
  const gapMm = settings?.labelGap || 3; // mm

  // Paper physical dimensions in mm (using 0.5mm safety buffer to eliminate DPI subpixel rounding spillover)
  const paperDimensions = {
    A4: { width: 210, height: 296.5 },
    F4: { width: 215, height: 329.5 },
    Letter: { width: 215.9, height: 278.5 }
  };

  const dim = paperDimensions[paper] || paperDimensions.A4;

  return (
    <div className="print-page-wrapper bg-white print:bg-white flex flex-col items-center mb-8 last:mb-0 print:m-0 print:p-0">
      
      {/* On-screen page label header (hidden during printing) */}
      <div className="no-print flex items-center justify-between w-full max-w-[210mm] px-2 py-1 mb-2 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
            Lembar {pageNumber} dari {totalPages}
          </span>
          <span className="text-slate-400">•</span>
          <span>{items.length} label di lembar ini</span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Kertas {paper} ({dim.width} × {Math.round(dim.height)} mm) • Grid {cols}×{rows}
        </span>
      </div>

      {/* Screen-only scale wrapper (neutralized to transform: none in print) */}
      <div
        className="screen-scale-wrapper origin-top print:bg-white print:m-0 print:p-0"
        style={{
          transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
          marginBottom: zoomScale !== 1 ? `${(zoomScale - 1) * dim.height}mm` : undefined,
        }}
      >
        {/* The Printable Paper Sheet */}
        <div
          className="print-sheet bg-white text-slate-900 shadow-xl border border-slate-200 print:shadow-none print:border-none print:bg-white print:m-0"
          style={{
            width: `${dim.width}mm`,
            height: `${dim.height}mm`,
            maxHeight: `${dim.height}mm`,
            padding: `${marginMm}mm`,
            boxSizing: 'border-box',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact'
          }}
        >
          {/* CSS Grid for the labels */}
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: `${gapMm}mm`,
              height: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            {items.map((item) => {
              const colorConfig = categoryColors[item.kategori] || {
                bg: '#6B2D82',
                text: '#ffffff',
                border: '#521d66'
              };

              return (
                <div key={item.id} className="w-full h-full overflow-hidden box-border">
                  <LabelCard
                    item={item}
                    colorConfig={colorConfig}
                    settings={settings}
                    onEdit={onEditItem}
                    onDuplicate={onDuplicateItem}
                    isInteractive={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
