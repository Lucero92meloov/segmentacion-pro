import React from 'react';

export default function StatCard({
  icon: Icon,
  number,
  label,
  sublabel,
  isSecondarySolid = false,
  derivedColors
}) {
  const cardStyle = isSecondarySolid
    ? {
        backgroundColor: derivedColors.secondary,
        borderColor: derivedColors.secondary,
        color: '#FFFFFF'
      }
    : {
        backgroundColor: derivedColors.cardBgPrimary,
        borderColor: derivedColors.cardBorderPrimary,
        color: derivedColors.text
      };

  const labelColor = isSecondarySolid
    ? 'rgba(255, 255, 255, 0.85)'
    : derivedColors.textMuted;

  const iconColor = isSecondarySolid
    ? '#FFFFFF'
    : derivedColors.primary;

  return (
    <div
      className="p-5 rounded-[4px] border-[1.5px] flex flex-col justify-between h-full shadow-sm"
      style={cardStyle}
    >
      <div className="flex items-center justify-between mb-2">
        {Icon && <Icon className="w-8 h-8" style={{ color: iconColor }} strokeWidth={1.8} />}
      </div>

      <div>
        <div className="text-[44px] font-extrabold leading-none tracking-tight font-poppins">
          {number}
        </div>
        <div
          className="text-[15px] font-medium leading-snug mt-2 font-poppins"
          style={{ color: labelColor }}
        >
          {label}
          {sublabel && (
            <span className="block text-[12px] opacity-80 font-normal">
              {sublabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
