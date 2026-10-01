import React from 'react';

export default function Strip({ prioritizedDaysText, summarySentence, derivedColors }) {
  return (
    <div
      className="p-7 rounded-[12px] border-[1.5px] bg-white/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 font-poppins"
      style={{
        borderColor: derivedColors.cardBorderSecondary,
        backgroundColor: derivedColors.cardBgSecondary
      }}
    >
      {/* Left side: Prioritized Days */}
      <div className="flex-shrink-0 text-center md:text-left">
        <div className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
          Días clave de inversión
        </div>
        <div
          className="text-[38px] font-extrabold tracking-tight leading-none"
          style={{ color: derivedColors.secondary }}
        >
          {prioritizedDaysText || 'Vie · Sáb · Dom'}
        </div>
      </div>

      {/* Vertical divider */}
      <div
        className="hidden md:block w-[2px] self-stretch opacity-30"
        style={{ backgroundColor: derivedColors.secondary }}
      />

      {/* Right side: Summary sentence */}
      <div className="flex-1 text-center md:text-left">
        <div className="text-[13px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
          Recomendación de pauta
        </div>
        <p
          className="text-[20px] font-medium leading-snug"
          style={{ color: derivedColors.text }}
        >
          {summarySentence}
        </p>
      </div>
    </div>
  );
}
