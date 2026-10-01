import React from 'react';
import { Palette, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { DEFAULT_THEMES } from '../../constants/defaultThemes';
import { checkThemeContrast } from '../../utils/themeUtils';

export default function ThemePanel({ themeColors, setThemeColors, currentThemeId, setCurrentThemeId }) {
  const contrastCheck = checkThemeContrast(themeColors.text, themeColors.bg);

  const handleSelectPreset = (theme) => {
    setCurrentThemeId(theme.id);
    setThemeColors(theme.colors);
  };

  const handleColorChange = (key, value) => {
    setCurrentThemeId('custom');
    setThemeColors((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-500" />
          Tema y Colores
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Elige entre 8 temas predefinidos o personaliza los 4 colores del informe.
        </p>
      </div>

      {/* Preset Themes Grid (8 themes in 2-column grid) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
          <span>Temas Predefinidos ({DEFAULT_THEMES.length})</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {DEFAULT_THEMES.map((theme) => {
            const isSelected = currentThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectPreset(theme)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-500/5'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {theme.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                </div>

                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Color principal"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Color secundario"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.colors.bg }}
                    title="Fondo"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: theme.colors.text }}
                    title="Texto"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 truncate">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Editor Personalizado (4 Colores)
          </label>
          {currentThemeId === 'custom' && (
            <span className="text-[10px] font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
              Personalizado
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'primary', label: 'Color Principal' },
            { key: 'secondary', label: 'Color Secundario' },
            { key: 'bg', label: 'Fondo del Informe' },
            { key: 'text', label: 'Color del Texto' }
          ].map((item) => (
            <div
              key={item.key}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {item.label}
                </p>
                <p className="text-[11px] font-mono text-zinc-500 uppercase">
                  {themeColors[item.key]}
                </p>
              </div>

              <div className="relative flex items-center">
                <input
                  type="color"
                  value={themeColors[item.key]}
                  onChange={(e) => handleColorChange(item.key, e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrast Warning Banner */}
      {!contrastCheck.isReadable && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Advertencia de Contraste</p>
            <p className="mt-0.5">{contrastCheck.warning}</p>
          </div>
        </div>
      )}
    </div>
  );
}
