import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sliders, ToggleLeft, ToggleRight, Layout, Shapes } from 'lucide-react';

export default function CropControls({
  zoom,
  setZoom,
  isDuotone,
  setIsDuotone,
  frameShape,
  setFrameShape,
  layoutMode,
  setLayoutMode,
  resetCrop
}) {
  return (
    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
      {/* Duotone Toggle & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsDuotone(!isDuotone)}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            {isDuotone ? (
              <ToggleRight className="w-5 h-5 text-rose-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-zinc-400" />
            )}
            <span>Efecto Duotono ({isDuotone ? 'Activado' : 'Desactivado'})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={resetCrop}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer encuadre
        </button>
      </div>

      {/* Zoom Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-rose-500" />
            Zoom del encuadre
          </span>
          <span className="font-mono text-zinc-500">{zoom.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-2">
          <ZoomOut className="w-4 h-4 text-zinc-400" />
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <ZoomIn className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* Frame Shape Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Shapes className="w-3.5 h-3.5 text-rose-500" />
          Forma del Marco
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'auto', label: 'Automático' },
            { id: 'arco', label: 'Arco' },
            { id: 'rounded', label: 'Redondeado' },
            { id: 'square', label: 'Cuadrado' }
          ].map((shape) => (
            <button
              key={shape.id}
              type="button"
              onClick={() => setFrameShape(shape.id)}
              className={`py-1.5 px-2 rounded-lg font-medium text-center transition ${
                frameShape === shape.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Mode Override Selector */}
      <div className="space-y-1.5 pt-1 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-rose-500" />
          Diseño del Hero
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: 'auto', label: 'Detección Auto' },
            { id: 'vertical', label: 'Foto Vertical (Arco)' },
            { id: 'horizontal', label: 'Foto Horizontal (Banner)' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setLayoutMode(mode.id)}
              className={`py-1.5 px-2 rounded-lg font-medium text-center transition ${
                layoutMode === mode.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
