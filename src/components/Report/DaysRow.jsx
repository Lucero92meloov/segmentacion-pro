import React from 'react';

export default function DaysRow({ prioritizedDays = [], derivedColors }) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isPrioritized = prioritizedDays.includes(day);

        const style = isPrioritized
          ? {
              backgroundColor: derivedColors.cardBgSecondary,
              borderColor: derivedColors.secondary,
              color: derivedColors.secondary,
              fontWeight: 700
            }
          : {
              backgroundColor: 'transparent',
              borderColor: derivedColors.cardBorderSecondary,
              color: derivedColors.textSubtle,
              fontWeight: 400
            };

        return (
          <div
            key={day}
            className="py-3 px-1 rounded-lg border-[1.5px] text-center text-[16px] font-poppins transition shadow-xs"
            style={style}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}
