import React from 'react';

export default function Block({
  title,
  icon: Icon,
  variant = 'primary', // 'primary' | 'secondary'
  derivedColors,
  children
}) {
  const isPrimary = variant === 'primary';
  const color = isPrimary ? derivedColors.primary : derivedColors.secondary;
  const borderColor = isPrimary ? derivedColors.cardBorderPrimary : derivedColors.cardBorderSecondary;

  return (
    <div
      className="p-8 rounded-[12px] border-[1.5px] bg-white/70 shadow-xs flex flex-col justify-between font-poppins"
      style={{ borderColor }}
    >
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-200/60 pb-4">
          {Icon && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="w-6 h-6" style={{ color }} strokeWidth={1.8} />
            </div>
          )}
          <h3
            className="text-[28px] font-extrabold uppercase tracking-wide"
            style={{ color }}
          >
            {title}
          </h3>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
