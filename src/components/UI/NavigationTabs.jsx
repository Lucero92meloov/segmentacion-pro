import React from 'react';
import { FileText, Image as ImageIcon, Palette, Download } from 'lucide-react';

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'image', label: 'Imagen', icon: ImageIcon },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'export', label: 'Exportar', icon: Download },
  ];

  return (
    <>
      {/* Desktop Tabs Header */}
      <div className="hidden lg:flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${
                isActive
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around py-1.5 px-2 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-all ${
                isActive
                  ? 'text-rose-400 font-semibold bg-rose-500/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
