import React, { useState } from 'react';
import { Bot, Copy, Check, ExternalLink, Sparkles, X } from 'lucide-react';

export default function GeminiPromptModal({ isOpen, onClose }) {
  const [songUrl, setSongUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatePromptText = () => {
    const targetUrl = songUrl.trim() || '[PEGA AQUÍ LA URL O NOMBRE DE LA CANCIÓN]';
    return `Actúa como un experto en marketing musical y segmentación de campañas digitales. Analiza la siguiente canción o lanzamiento musical:
${targetUrl}

Genera un informe completo de estrategia de lanzamiento en formato Markdown estricto respetando EXACTAMENTE la siguiente estructura para que la aplicación Segmentación Pro la procese automáticamente. No agregues texto introductorio ni explicaciones adicionales fuera del bloque Markdown:

# [Nombre de la Canción o Lanzamiento]
[Nombre del Artista / Artistas]
Estrategia de lanzamiento

## Audiencia (Target)
- Edad: [Rango de edad, ej: 18 a 34 años]
- Intereses: [Lista separada por comas de intereses, estilos de vida o micro-culturas]
- Ubicación: [Países o ciudades foco]
  1. [País o ciudad 1]
  2. [País o ciudad 2]
  3. [País o ciudad 3]
  4. [País o ciudad 4]

## Placements
### [Nombre del Grupo 1, ej: Playlists Urbanas y Fiestas]
- [Playlist o canal 1]
- [Playlist o canal 2]
### [Nombre del Grupo 2, ej: Redes Sociales y Tendencias]
- [Tipo de contenido o canal 1]
- [Tipo de contenido o canal 2]

## Referencias musicales
- Estilo: [Géneros musicales principales y fusiones]
- Contextos de uso: [Ejemplos de momentos de escucha: Para la fiesta, Entrenar / Gym, Para el pre]
- Artistas similares: [Nombres de 3 a 5 artistas referentes de la escena]

## Retargeting
- Horarios de posible mayor consumo: [Especifica exactamente dos horarios clave en formato HH:MM, ej: 20:00 y 03:00]
- Días priorizables: [Especifica los días clave, ej: viernes, sábado y domingo]`;
  };

  const handleCopy = () => {
    const promptText = generatePromptText();
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                Generador de Prompt para Gemini AI
                <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                  IA Ready
                </span>
              </h3>
              <p className="text-xs text-zinc-500">
                Pasa una URL de canción a Gemini y obtén tu informe listo para pegar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Song URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            URL de la canción o nombre del artista (Opcional):
          </label>
          <input
            type="text"
            value={songUrl}
            onChange={(e) => setSongUrl(e.target.value)}
            placeholder="Ej: https://open.spotify.com/track/... o Bad Bunny - Monaco"
            className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Prompt Preview Textarea */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Prompt generado:
          </span>
          <textarea
            readOnly
            value={generatePromptText()}
            rows={9}
            className="w-full p-3 font-mono text-[11px] leading-relaxed rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 focus:outline-none resize-none select-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <a
            href="https://gemini.google.com/app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
            Abrir Gemini AI
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Prompt Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Prompt para Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
