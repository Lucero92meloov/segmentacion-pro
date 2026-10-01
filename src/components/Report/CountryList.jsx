import React from 'react';

export default function CountryList({ countries = [], derivedColors }) {
  if (!countries || countries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {countries.map((country, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border-[1.3px] font-poppins"
          style={{
            backgroundColor: derivedColors.cardBgPrimary,
            borderColor: derivedColors.cardBorderPrimary
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
            style={{
              backgroundColor: derivedColors.primary,
              color: '#FFFFFF'
            }}
          >
            {index + 1}
          </div>
          <span
            className="text-[17px] font-semibold truncate"
            style={{ color: derivedColors.text }}
          >
            {country}
          </span>
        </div>
      ))}
    </div>
  );
}
