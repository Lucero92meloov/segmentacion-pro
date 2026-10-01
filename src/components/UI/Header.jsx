import React from 'react';
import { Sparkles, Disc } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-zinc-900 text-white border-b border-zinc-800 px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-inner">
          <Disc className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
            Segmentación Pro
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-zinc-400">Generador de Informes de Segmentación Musical</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/50">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Mobile First · 100% Privado en Navegador</span>
      </div>
    </header>
  );
}
