import React, { useState } from 'react';
import { Download, FileImage, FileCode, Share2, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { exportAsPng, exportAsJpg, exportAsPdf } from '../../utils/exportUtils';

export default function ExportPanel({ reportRef, title, themeBg }) {
  const [pngScale, setPngScale] = useState(2);
  const [jpgQuality, setJpgQuality] = useState(92);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleExport = async (type) => {
    if (!reportRef.current || isExporting) return;

    setIsExporting(true);
    setExportType(type);
    setSuccessMessage(null);

    try {
      if (type === 'png') {
        await exportAsPng(reportRef.current, title, pngScale, themeBg);
      } else if (type === 'jpg') {
        await exportAsJpg(reportRef.current, title, jpgQuality / 100, pngScale, themeBg);
      } else if (type === 'pdf') {
        await exportAsPdf(reportRef.current, title, themeBg);
      }
      setSuccessMessage(`¡Informe exportado correctamente en formato ${type.toUpperCase()}!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Hubo un problema al exportar el archivo. Por favor inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-rose-500" />
          Exportar Resultado
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Descarga o comparte tu informe visual en alta resolución (1600px+).
        </p>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* PNG Export Options */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Imagen PNG (Fondo Opaco)</p>
              <p className="text-[10px] text-zinc-500">Formato recomendado para redes y envíos</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">Resolución de Escala:</span>
          <div className="flex items-center gap-1.5">
            {[
              { scale: 1, label: '1x (1600px)' },
              { scale: 2, label: '2x (3200px)' },
              { scale: 3, label: '3x (4800px)' }
            ].map((opt) => (
              <button
                key={opt.scale}
                type="button"
                onClick={() => setPngScale(opt.scale)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  pngScale === opt.scale
                    ? 'bg-rose-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleExport('png')}
          disabled={isExporting}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
        >
          {isExporting && exportType === 'png' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Exportar como PNG ({1600 * pngScale}px)</span>
        </button>
      </div>

      {/* JPG Export Options */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Imagen JPG (Comprimida)</p>
              <p className="text-[10px] text-zinc-500">Ideal si requieres menor peso de archivo</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            <span>Calidad JPG:</span>
            <span className="font-mono text-amber-500">{jpgQuality}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="100"
            step="1"
            value={jpgQuality}
            onChange={(e) => setJpgQuality(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={() => handleExport('jpg')}
          disabled={isExporting}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
        >
          {isExporting && exportType === 'jpg' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Exportar como JPG ({jpgQuality}%)</span>
        </button>
      </div>

      {/* PDF Export Options */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Documento PDF (1 Página)</p>
              <p className="text-[10px] text-zinc-500">Informe editorial completo en página única</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
        >
          {isExporting && exportType === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Exportar como PDF</span>
        </button>
      </div>

      <div className="p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl text-xs text-zinc-500 flex items-center gap-2">
        <Share2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
        <span>En dispositivos móviles se intentará abrir el menú de compartir nativo.</span>
      </div>
    </div>
  );
}
