import React from 'react';
import { Users, Globe, Clock, Calendar } from 'lucide-react';
import DuotoneCanvas from '../Image/DuotoneCanvas';
import StatCard from './StatCard';

export default function Hero({
  parsedData,
  imageDataUrl,
  isVertical,
  isDuotone,
  zoom,
  panX,
  panY,
  frameShape,
  layoutMode,
  derivedColors,
  themeColors
}) {
  const { title, artists, subtitle, highlights } = parsedData;

  // Split title into two lines if space or newline present
  const titleWords = (title || 'Glu Glu').trim().split(/\s+/);
  let line1 = title;
  let line2 = artists || 'Lanzamiento';

  if (titleWords.length > 1) {
    const mid = Math.ceil(titleWords.length / 2);
    line1 = titleWords.slice(0, mid).join(' ');
    line2 = titleWords.slice(mid).join(' ');
  }

  // Determine effective layout mode
  let activeLayout = layoutMode;
  if (activeLayout === 'auto') {
    if (!imageDataUrl) activeLayout = 'nophoto';
    else if (isVertical) activeLayout = 'vertical';
    else activeLayout = 'horizontal';
  }

  const statCardsData = [
    {
      icon: Users,
      number: highlights.ageRange || '18–34',
      label: 'Rango de edad',
      sublabel: 'Target principal',
      isSecondarySolid: false
    },
    {
      icon: Globe,
      number: highlights.countriesCount || '4',
      label: highlights.countriesCount === 1 ? 'País foco' : 'Países foco',
      sublabel: 'Latinoamérica',
      isSecondarySolid: true
    },
    {
      icon: Clock,
      number: highlights.primaryTime || '20:00',
      label: highlights.secondaryTimeTag || 'y 03:00, mayor consumo',
      sublabel: 'Horario pico',
      isSecondarySolid: false
    },
    {
      icon: Calendar,
      number: `${highlights.prioritizedDaysCount || 3} días`,
      label: 'Priorizados',
      sublabel: 'Fin de semana',
      isSecondarySolid: true
    }
  ];

  // Render Layout 1: Vertical Photo (3 columns: 1fr 430px 1fr)
  if (activeLayout === 'vertical' && imageDataUrl) {
    return (
      <div className="grid grid-cols-[1fr_430px_1fr] gap-8 items-center font-poppins">
        {/* Left Column: Title & Info */}
        <div className="flex flex-col justify-between h-full py-2">
          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-[13px] font-bold uppercase tracking-wider mb-4 border"
              style={{
                backgroundColor: derivedColors.chipBg,
                borderColor: derivedColors.chipBorder,
                color: derivedColors.primary
              }}
            >
              {subtitle || 'Estrategia de lanzamiento'}
            </div>

            <h2 className="text-[112px] font-extrabold leading-[0.9] tracking-[-3px] uppercase mb-4">
              <span className="block" style={{ color: derivedColors.primary }}>
                {line1}
              </span>
              <span className="block" style={{ color: derivedColors.secondary }}>
                {line2}
              </span>
            </h2>
          </div>

          <div>
            <p className="text-[22px] font-semibold text-zinc-700 leading-snug">
              {artists}
            </p>
            <p className="text-[15px] font-medium text-zinc-400 mt-1">
              Informe de segmentación de audiencia y pauta digital
            </p>
          </div>
        </div>

        {/* Center Column: Photo in 430x600px Arch Frame */}
        <div className="w-[430px] h-[600px]">
          <DuotoneCanvas
            imageDataUrl={imageDataUrl}
            isDuotone={isDuotone}
            themeColors={themeColors}
            zoom={zoom}
            panX={panX}
            panY={panY}
            frameShape={frameShape === 'auto' ? 'arco' : frameShape}
            isVertical={true}
            artistName={artists || title}
          />
        </div>

        {/* Right Column: 4 Stat Cards in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 h-[600px]">
          {statCardsData.map((card, index) => (
            <StatCard
              key={index}
              icon={card.icon}
              number={card.number}
              label={card.label}
              sublabel={card.sublabel}
              isSecondarySolid={card.isSecondarySolid}
              derivedColors={derivedColors}
            />
          ))}
        </div>
      </div>
    );
  }

  // Render Layout 2: Horizontal Photo (2 columns: 700px 1fr)
  if (activeLayout === 'horizontal' && imageDataUrl) {
    return (
      <div className="grid grid-cols-[700px_1fr] gap-8 items-center font-poppins">
        {/* Left Column: Photo in 700x430px Banner Frame */}
        <div className="w-[700px] h-[430px]">
          <DuotoneCanvas
            imageDataUrl={imageDataUrl}
            isDuotone={isDuotone}
            themeColors={themeColors}
            zoom={zoom}
            panX={panX}
            panY={panY}
            frameShape={frameShape === 'auto' ? 'rounded' : frameShape}
            isVertical={false}
            artistName={artists || title}
          />
        </div>

        {/* Right Column: Title & 4 Stat Cards Row */}
        <div className="flex flex-col justify-between h-[430px]">
          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-[13px] font-bold uppercase tracking-wider mb-2 border"
              style={{
                backgroundColor: derivedColors.chipBg,
                borderColor: derivedColors.chipBorder,
                color: derivedColors.primary
              }}
            >
              {subtitle || 'Estrategia de lanzamiento'}
            </div>

            <h2 className="text-[86px] font-extrabold leading-[0.9] tracking-[-3px] uppercase mb-2">
              <span className="inline mr-3" style={{ color: derivedColors.primary }}>
                {line1}
              </span>
              <span className="inline" style={{ color: derivedColors.secondary }}>
                {line2}
              </span>
            </h2>

            <p className="text-[20px] font-semibold text-zinc-700">
              {artists}
            </p>
          </div>

          {/* 4 Stat Cards in Single Row */}
          <div className="grid grid-cols-4 gap-3 h-[180px]">
            {statCardsData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                number={card.number}
                label={card.label}
                sublabel={card.sublabel}
                isSecondarySolid={card.isSecondarySolid}
                derivedColors={derivedColors}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Layout 3: No Photo (Full Width Title & Cards Row)
  return (
    <div className="space-y-8 font-poppins py-4">
      <div className="flex items-center justify-between">
        <div>
          <div
            className="inline-block px-3.5 py-1 rounded-full text-[13px] font-bold uppercase tracking-wider mb-3 border"
            style={{
              backgroundColor: derivedColors.chipBg,
              borderColor: derivedColors.chipBorder,
              color: derivedColors.primary
            }}
          >
            {subtitle || 'Estrategia de lanzamiento'}
          </div>

          <h2 className="text-[112px] font-extrabold leading-[0.9] tracking-[-3.5px] uppercase">
            <span className="inline mr-4" style={{ color: derivedColors.primary }}>
              {line1}
            </span>
            <span className="inline" style={{ color: derivedColors.secondary }}>
              {line2}
            </span>
          </h2>

          <p className="text-[26px] font-bold text-zinc-800 mt-2">
            {artists}
          </p>
        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-4 gap-4 h-[200px]">
        {statCardsData.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            number={card.number}
            label={card.label}
            sublabel={card.sublabel}
            isSecondarySolid={card.isSecondarySolid}
            derivedColors={derivedColors}
          />
        ))}
      </div>
    </div>
  );
}
