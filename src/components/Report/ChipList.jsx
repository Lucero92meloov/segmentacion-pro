import React from 'react';

export default function ChipList({ items = [], fillFirst = false, derivedColors }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item, index) => {
        const isFirstFilled = fillFirst && index === 0;

        const chipStyle = isFirstFilled
          ? {
              backgroundColor: derivedColors.primary,
              borderColor: derivedColors.primary,
              color: '#FFFFFF'
            }
          : {
              backgroundColor: derivedColors.chipBg,
              borderColor: derivedColors.chipBorder,
              color: derivedColors.text
            };

        return (
          <span
            key={index}
            className="px-4 py-2 rounded-full text-[16.5px] font-medium border-[1.3px] leading-snug font-poppins shadow-xs"
            style={chipStyle}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}
