import React from 'react';
import { Clock } from 'lucide-react';

export default function TimeCards({ times = [], derivedColors }) {
  if (!times || times.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {times.map((time, index) => (
        <div
          key={index}
          className="p-5 rounded-[8px] flex flex-col justify-between shadow-sm font-poppins"
          style={{
            backgroundColor: derivedColors.secondary,
            color: '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <Clock className="w-5 h-5 text-white/80" strokeWidth={1.8} />
            <span className="text-[12px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white">
              {index === 0 ? 'Pico' : 'Secundario'}
            </span>
          </div>
          <div>
            <div className="text-[52px] font-extrabold leading-none tracking-tight">
              {time}
            </div>
            <div className="text-[14px] font-medium text-white/80 mt-1">
              {index === 0 ? 'Mayor consumo' : 'Consumo secundario'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
