import React, { useRef, useState } from 'react';
import { Upload, RotateCcw, FileText, Sparkles, Bot } from 'lucide-react';
import { DEFAULT_MARKDOWN } from '../../constants/sampleMarkdown';
import AlertBanner from '../UI/AlertBanner';
import GeminiPromptModal from '../UI/GeminiPromptModal';

export default function ContentEditor({ markdownText, setMarkdownText, warnings }) {
  const fileInputRef = useRef(null);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setMarkdownText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Header & Main Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-500" />
            Contenido Markdown
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pega o edita la estrategia de lanzamiento en formato Markdown.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Subir .md
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setMarkdownText(DEFAULT_MARKDOWN)}
            title="Restablecer ejemplo por defecto"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ejemplo
          </button>
        </div>
      </div>

      {/* Gemini AI Prompt Banner Callout */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-purple-900/10 border border-purple-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
              Generar desde Canción con Gemini AI
              <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-mono">
                Nuevo
              </span>
            </p>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              Obtén el prompt para que Gemini analice un enlace de canción y cree este Markdown.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsGeminiModalOpen(true)}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Copiar Prompt
        </button>
      </div>

      <AlertBanner warnings={warnings} />

      {/* Textarea Editor */}
      <div className="relative">
        <textarea
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
          placeholder="Escribe o pega aquí el informe en Markdown..."
          rows={16}
          className="w-full p-3 font-mono text-xs leading-relaxed rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-rose-500 focus:outline-none shadow-inner resize-y"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
          {markdownText.length} caracteres
        </div>
      </div>

      <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
        <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Tip de formato:
        </span>
        <p>
          Usa <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-200"># Título</code> para el lanzamiento, y secciones <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-200">## Audiencia</code>, <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-200">## Referencias musicales</code>, <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-200">## Placements</code> y <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-200">## Retargeting</code>.
        </p>
      </div>

      {/* Gemini Prompt Modal */}
      <GeminiPromptModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
      />
    </div>
  );
}
