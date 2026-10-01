import React, { forwardRef } from 'react';
import { Users, Music, Radio, Clock, HelpCircle, Target, Sparkles, Layers } from 'lucide-react';
import { getDerivedColors } from '../../utils/themeUtils';
import Hero from './Hero';
import Block from './Block';
import ChipList from './ChipList';
import CountryList from './CountryList';
import ArtistList from './ArtistList';
import TimeCards from './TimeCards';
import DaysRow from './DaysRow';
import Strip from './Strip';

const Report = forwardRef(({
  parsedData,
  imageDataUrl,
  isVertical,
  isDuotone,
  zoom,
  panX,
  panY,
  frameShape,
  layoutMode,
  themeColors
}, ref) => {
  const derivedColors = getDerivedColors(themeColors);
  const { title, audience, references, placements, retargeting, unknownBlocks } = parsedData;

  return (
    <div
      ref={ref}
      id="report-poster"
      className="w-[1600px] min-h-[1950px] font-poppins relative box-border shadow-2xl transition-colors duration-200"
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.text,
        padding: '56px'
      }}
    >
      {/* Outer 2px Primary Border Container */}
      <div
        className="w-full h-full border-[2px] rounded-[16px] flex flex-col justify-between box-border overflow-hidden"
        style={{
          borderColor: derivedColors.primary,
          padding: '36px',
          gap: '36px'
        }}
      >
        {/* SECTION 1: HERO HEADER */}
        <Hero
          parsedData={parsedData}
          imageDataUrl={imageDataUrl}
          isVertical={isVertical}
          isDuotone={isDuotone}
          zoom={zoom}
          panX={panX}
          panY={panY}
          frameShape={frameShape}
          layoutMode={layoutMode}
          derivedColors={derivedColors}
          themeColors={themeColors}
        />

        {/* SECTION 2: 2x2 GRID OF SECTIONS (22px gap) */}
        <div className="grid grid-cols-2 gap-[22px]">
          {/* BLOCK 1: AUDIENCIA (TARGET) */}
          <Block
            title="Audiencia (Target)"
            icon={Users}
            variant="primary"
            derivedColors={derivedColors}
          >
            {/* Edad & Intereses */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[16px] font-semibold text-zinc-600">
                <Target className="w-4 h-4 text-rose-500" />
                <span>Perfil e Intereses clave</span>
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                {audience.ageRange && (
                  <ChipList
                    items={[`Edad: ${audience.ageRange} años`]}
                    fillFirst={true}
                    derivedColors={derivedColors}
                  />
                )}
                <ChipList
                  items={audience.interests}
                  fillFirst={false}
                  derivedColors={derivedColors}
                />
              </div>
            </div>

            {/* Ubicación / Países */}
            {audience.countries.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-[16px] font-semibold text-zinc-600">
                  Ubicación geográfica (Foco en)
                </div>
                <CountryList
                  countries={audience.countries}
                  derivedColors={derivedColors}
                />
              </div>
            )}
          </Block>

          {/* BLOCK 2: REFERENCIAS MUSICALES */}
          <Block
            title="Referencias musicales"
            icon={Music}
            variant="secondary"
            derivedColors={derivedColors}
          >
            {/* Estilos */}
            {references.style.length > 0 && (
              <div className="space-y-2">
                <div className="text-[16px] font-semibold text-zinc-600">
                  Estilos y Géneros principales
                </div>
                <ChipList
                  items={references.style}
                  fillFirst={true}
                  derivedColors={derivedColors}
                />
              </div>
            )}

            {/* Contextos de uso */}
            {references.uses.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[16px] font-semibold text-zinc-600">
                  Contextos de escucha
                </div>
                <ChipList
                  items={references.uses}
                  fillFirst={false}
                  derivedColors={derivedColors}
                />
              </div>
            )}

            {/* Artistas similares */}
            {references.artists.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[16px] font-semibold text-zinc-600">
                  Artistas similares y referencia
                </div>
                <ArtistList
                  artists={references.artists}
                  derivedColors={derivedColors}
                />
              </div>
            )}
          </Block>

          {/* BLOCK 3: PLACEMENTS */}
          <Block
            title="Placements & Canales"
            icon={Radio}
            variant="secondary"
            derivedColors={derivedColors}
          >
            {/* Default Group if any */}
            {placements.defaultGroup.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[16px] font-semibold text-zinc-600">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Canales sugeridos</span>
                </div>
                <ChipList
                  items={placements.defaultGroup}
                  fillFirst={false}
                  derivedColors={derivedColors}
                />
              </div>
            )}

            {/* Labeled Subgroups from ### */}
            {placements.subgroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 text-[16px] font-semibold text-zinc-600">
                  <Sparkles className="w-4.5 h-4.5" style={{ color: derivedColors.secondary }} />
                  <span>{group.title}</span>
                </div>
                <ChipList
                  items={group.items}
                  fillFirst={false}
                  derivedColors={derivedColors}
                />
              </div>
            ))}
          </Block>

          {/* BLOCK 4: RETARGETING */}
          <Block
            title="Retargeting & Horarios"
            icon={Clock}
            variant="primary"
            derivedColors={derivedColors}
          >
            {/* Horarios Cards */}
            <div className="space-y-2">
              <div className="text-[16px] font-semibold text-zinc-600">
                Horarios de mayor consumo
              </div>
              <TimeCards
                times={retargeting.times}
                derivedColors={derivedColors}
              />
            </div>

            {/* Días priorizables */}
            <div className="space-y-2 pt-2">
              <div className="text-[16px] font-semibold text-zinc-600">
                Días priorizables de campaña
              </div>
              <DaysRow
                prioritizedDays={retargeting.prioritizedDaysList}
                derivedColors={derivedColors}
              />
            </div>
          </Block>
        </div>

        {/* UNKNOWN GENERIC BLOCKS (IF ANY) */}
        {unknownBlocks.map((ublock, uidx) => (
          <Block
            key={uidx}
            title={ublock.title}
            icon={HelpCircle}
            variant="primary"
            derivedColors={derivedColors}
          >
            <ChipList
              items={ublock.items}
              fillFirst={false}
              derivedColors={derivedColors}
            />
          </Block>
        ))}

        {/* SECTION 3: BOTTOM STRIP */}
        <Strip
          prioritizedDaysText={retargeting.prioritizedDaysList.join(' · ')}
          summarySentence={retargeting.summarySentence}
          derivedColors={derivedColors}
        />

        {/* SECTION 4: FOOTER */}
        <footer className="flex items-center justify-between border-t border-zinc-300/60 pt-4 text-[15px] font-semibold text-zinc-500 font-poppins">
          <div>
            <span>{title || 'Glu Glu'}</span>
          </div>
          <div className="uppercase tracking-wider text-[13px] text-zinc-400">
            Segmentación y Canales
          </div>
        </footer>
      </div>
    </div>
  );
});

export default Report;
