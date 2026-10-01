const ALL_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Normalize string by removing markdown symbols, accents, extra whitespace and converting to lowercase.
 */
function normalizeKey(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\*\_\#\•\-\:\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Remove markdown styling (*, _, `, #) from string.
 */
function cleanMarkdownText(str) {
  if (!str) return '';
  return str
    .replace(/^[\#\*\-\•\d\.\s]+/, '')
    .replace(/[\*\_\`]/g, '')
    .trim();
}

/**
 * Filter out filler lead-in phrases like "foco en:", "especialmente en", "en:", etc.
 */
function filterOutFillerPhrases(items) {
  const fillers = ['foco en', 'foco en:', 'foco', 'foco:', 'especialmente en', 'especialmente', 'en:', 'prioridad en', 'prioridad en:'];
  return items
    .map(p => cleanMarkdownText(p))
    .filter(item => {
      const norm = normalizeKey(item);
      return norm.length > 0 && !fillers.includes(norm);
    });
}

/**
 * Extract items split by commas, " y ", " e ", or newlines.
 */
function splitListItems(text) {
  if (!text) return [];
  // Remove trailing intro phrases like ", foco en:" or ", especialmente en:"
  const cleanedText = text
    .replace(/,\s*(?:foco\sen:?|especialmente\sen:?|prioridad\sen:?|en:?)$/i, '')
    .replace(/^[\-\*\•\d\.\s]+/, '')
    .trim();

  const parts = cleanedText.split(/,|(?:\sy\s)|(?:\se\s)/i);
  return filterOutFillerPhrases(parts);
}

/**
 * Normalize single day string to Lun, Mar, Mié, Jue, Vie, Sáb, Dom.
 */
function normalizeDay(dayStr) {
  if (!dayStr) return null;
  const norm = normalizeKey(dayStr);
  if (norm.includes('lun')) return 'Lun';
  if (norm.includes('mar')) return 'Mar';
  if (norm.includes('mie')) return 'Mié';
  if (norm.includes('jue')) return 'Jue';
  if (norm.includes('vie')) return 'Vie';
  if (norm.includes('sab')) return 'Sáb';
  if (norm.includes('dom')) return 'Dom';
  return null;
}

/**
 * Parse days from any text string, supporting explicit days, ranges, and "fin de semana".
 */
function parseDaysFromText(text) {
  if (!text) return [];
  const cleanedText = cleanMarkdownText(text);
  const norm = cleanedText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const daysFound = new Set();

  // 1. Check for "fin de semana"
  if (norm.includes('fin de semana')) {
    daysFound.add('Vie');
    daysFound.add('Sáb');
    daysFound.add('Dom');
  }

  // 2. Direct day token matching
  const tokens = norm.split(/[\s,;\.\-\/:\(\)]+/);
  tokens.forEach(token => {
    const d = normalizeDay(token);
    if (d) daysFound.add(d);
  });

  // 3. Range expansion ONLY if exactly 2 days found AND an explicit range word ("a", "al", "hasta", "–") surrounded by spaces is present
  if (daysFound.size === 2 && /\s+(?:a|al|hasta|–|-)\s+/i.test(norm)) {
    const foundArr = Array.from(daysFound);
    const idx1 = ALL_DAYS.indexOf(foundArr[0]);
    const idx2 = ALL_DAYS.indexOf(foundArr[1]);
    if (idx1 !== -1 && idx2 !== -1) {
      const minIdx = Math.min(idx1, idx2);
      const maxIdx = Math.max(idx1, idx2);
      for (let i = minIdx; i <= maxIdx; i++) {
        daysFound.add(ALL_DAYS[i]);
      }
    }
  }

  return Array.from(daysFound);
}

/**
 * Parse time formats from text (e.g., "20:00", "03:00", "8:00", "20h", "8pm").
 */
function parseTimesFromText(text) {
  if (!text) return [];
  const times = [];
  
  // Match HH:MM or H:MM (e.g. 20:00, 03:00, 8:30)
  const matches = text.match(/\b\d{1,2}:\d{2}\b/g);
  if (matches) {
    matches.forEach(t => {
      const [h, m] = t.split(':');
      const formatted = `${h.padStart(2, '0')}:${m}`;
      if (!times.includes(formatted)) times.push(formatted);
    });
  }

  // Simple hour notation if no HH:MM found (e.g. 20h, 8pm)
  if (times.length === 0) {
    const simpleMatches = text.match(/\b(\d{1,2})\s*(?:hrs?|h|am|pm)\b/gi);
    if (simpleMatches) {
      simpleMatches.forEach(sm => {
        const numMatch = sm.match(/\d+/);
        if (numMatch) {
          let h = parseInt(numMatch[0], 10);
          if (sm.toLowerCase().includes('pm') && h < 12) h += 12;
          if (sm.toLowerCase().includes('am') && h === 12) h = 0;
          const formatted = `${String(h).padStart(2, '0')}:00`;
          if (!times.includes(formatted)) times.push(formatted);
        }
      });
    }
  }

  return times;
}

/**
 * Main line-based Markdown parser for Segmentación Pro.
 */
export function parseMarkdown(markdownText) {
  const lines = (markdownText || '').split(/\r?\n/);
  
  let title = 'Glu Glu';
  let artists = 'Manuva y Pauly Rouse';
  let subtitle = 'Estrategia de lanzamiento';
  
  const audience = { age: '', ageRange: '', interests: [], countries: [] };
  const references = { style: [], uses: [], artists: [] };
  const placements = { defaultGroup: [], subgroups: [] };
  const retargeting = { times: [], timeText: '', days: [], daysText: '' };
  
  const unknownBlocks = [];

  let currentMainSection = null; // 'audiencia' | 'referencias' | 'placements' | 'retargeting' | 'generic'
  let currentSubgroup = null;
  let currentKey = null;
  let genericBlock = null;

  const sectionFound = {
    audiencia: false,
    referencias: false,
    placements: false,
    retargeting: false
  };

  let titleCaptured = false;
  let subtitleLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    // Check header levels (# H1, ## H2, ### H3, #### H4)
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = cleanMarkdownText(headerMatch[2]);
      const normSection = normalizeKey(headerText);

      if (level === 1 && !titleCaptured) {
        title = headerText;
        titleCaptured = true;
        continue;
      }

      if (level >= 2) {
        currentSubgroup = null;
        currentKey = null;

        if (normSection.includes('audiencia') || normSection.includes('target') || normSection.includes('publico')) {
          currentMainSection = 'audiencia';
          sectionFound.audiencia = true;
        } else if (normSection.includes('referencia') || normSection.includes('musical')) {
          currentMainSection = 'referencias';
          sectionFound.referencias = true;
        } else if (normSection.includes('placement') || normSection.includes('canal')) {
          currentMainSection = 'placements';
          sectionFound.placements = true;
        } else if (
          normSection.includes('retargeting') ||
          normSection.includes('remarketing') ||
          normSection.includes('horario') ||
          normSection.includes('pauta') ||
          normSection.includes('programacion')
        ) {
          currentMainSection = 'retargeting';
          sectionFound.retargeting = true;
        } else {
          if (currentMainSection === 'placements' && level === 3) {
            currentSubgroup = { title: headerText, items: [] };
            placements.subgroups.push(currentSubgroup);
          } else {
            currentMainSection = 'generic';
            genericBlock = { title: headerText, items: [] };
            unknownBlocks.push(genericBlock);
          }
        }
        continue;
      }
    }

    // Subtitle / artists before any section header
    if (titleCaptured && !currentMainSection && !trimmed.startsWith('#')) {
      subtitleLines.push(cleanMarkdownText(trimmed));
      continue;
    }

    const cleanLine = cleanMarkdownText(trimmed);

    // Reliable Key: Value line detection
    const colonIdx = trimmed.indexOf(':');
    let isKeyValue = false;
    let keyStr = '';
    let valueStr = '';

    if (colonIdx > 0) {
      const beforeColon = trimmed.substring(0, colonIdx);
      const isTimePrefix = /\d{1,2}$/.test(beforeColon.trim());
      const isUrlPrefix = /^https?$/i.test(beforeColon.trim());
      if (!isTimePrefix && !isUrlPrefix) {
        isKeyValue = true;
        keyStr = normalizeKey(beforeColon);
        valueStr = trimmed.substring(colonIdx + 1).trim();
      }
    }

    if (isKeyValue) {
      // Audiencia keys
      if (currentMainSection === 'audiencia') {
        if (keyStr.includes('edad')) {
          audience.age = cleanMarkdownText(valueStr);
          const ageMatch = valueStr.match(/(\d+)\s*(?:a|–|-)\s*(\d+)/i);
          if (ageMatch) {
            audience.ageRange = `${ageMatch[1]}–${ageMatch[2]}`;
          } else {
            audience.ageRange = cleanMarkdownText(valueStr);
          }
          currentKey = 'edad';
        } else if (keyStr.includes('interes')) {
          audience.interests = splitListItems(valueStr);
          currentKey = 'intereses';
        } else if (keyStr.includes('ubicacion') || keyStr.includes('pais') || keyStr.includes('foco')) {
          if (valueStr) {
            audience.countries = filterOutFillerPhrases(splitListItems(valueStr));
          }
          currentKey = 'paises';
        }
      }
      // Referencias keys
      else if (currentMainSection === 'referencias') {
        if (keyStr.includes('estilo') || keyStr.includes('genero')) {
          references.style = splitListItems(valueStr);
          currentKey = 'estilo';
        } else if (keyStr.includes('contexto') || keyStr.includes('uso')) {
          references.uses = splitListItems(valueStr);
          currentKey = 'contextos';
        } else if (keyStr.includes('artista') || keyStr.includes('similar')) {
          references.artists = splitListItems(valueStr);
          currentKey = 'artistas';
        }
      }
      // Retargeting keys
      else if (currentMainSection === 'retargeting') {
        if (keyStr.includes('horario') || keyStr.includes('hora') || keyStr.includes('consumo') || keyStr.includes('pico') || keyStr.includes('tiempo')) {
          retargeting.timeText = cleanMarkdownText(valueStr);
          const foundTimes = parseTimesFromText(valueStr);
          foundTimes.forEach(t => {
            if (!retargeting.times.includes(t)) retargeting.times.push(t);
          });
          currentKey = 'horarios';
        } else if (keyStr.includes('dia') || keyStr.includes('semana') || keyStr.includes('prioriz') || keyStr.includes('frecuencia')) {
          retargeting.daysText = cleanMarkdownText(valueStr);
          const foundDays = parseDaysFromText(valueStr);
          foundDays.forEach(d => {
            if (!retargeting.days.includes(d)) retargeting.days.push(d);
          });
          currentKey = 'dias';
        } else {
          const foundTimes = parseTimesFromText(valueStr);
          const foundDays = parseDaysFromText(valueStr);
          foundTimes.forEach(t => { if (!retargeting.times.includes(t)) retargeting.times.push(t); });
          foundDays.forEach(d => { if (!retargeting.days.includes(d)) retargeting.days.push(d); });
        }
      }
      else if (currentMainSection === 'generic' && genericBlock) {
        genericBlock.items.push(cleanMarkdownText(trimmed));
      }
    } 
    // Bullet or text lines
    else {
      if (currentMainSection === 'audiencia') {
        if (currentKey === 'paises' || /^[\d\.]+\s*/.test(trimmed)) {
          const filtered = filterOutFillerPhrases([cleanLine]);
          if (filtered.length > 0) {
            audience.countries.push(...filtered);
          }
        } else if (currentKey === 'intereses') {
          audience.interests.push(cleanLine);
        } else {
          audience.interests.push(cleanLine);
        }
      } else if (currentMainSection === 'referencias') {
        if (currentKey === 'estilo') references.style.push(cleanLine);
        else if (currentKey === 'contextos') references.uses.push(cleanLine);
        else if (currentKey === 'artistas') references.artists.push(cleanLine);
        else references.style.push(cleanLine);
      } else if (currentMainSection === 'placements') {
        if (currentSubgroup) {
          currentSubgroup.items.push(cleanLine);
        } else {
          placements.defaultGroup.push(cleanLine);
        }
      } else if (currentMainSection === 'generic' && genericBlock) {
        genericBlock.items.push(cleanLine);
      }
    }

    // Universal scan for retargeting section lines to ensure 100% data extraction
    if (currentMainSection === 'retargeting') {
      const lineTimes = parseTimesFromText(cleanLine);
      const lineDays = parseDaysFromText(cleanLine);
      lineTimes.forEach(t => { if (!retargeting.times.includes(t)) retargeting.times.push(t); });
      lineDays.forEach(d => { if (!retargeting.days.includes(d)) retargeting.days.push(d); });
    }
  }

  // Clean audience countries of any filler phrases
  audience.countries = filterOutFillerPhrases(audience.countries);

  // Parse artists & subtitle if available from initial lines
  if (subtitleLines.length > 0) {
    artists = subtitleLines[0];
    if (subtitleLines.length > 1) {
      subtitle = subtitleLines.slice(1).join(' · ');
    }
  }

  // FAIL-SAFE GLOBAL SCAN FOR RETARGETING TIMES AND DAYS:
  if (retargeting.times.length === 0 || retargeting.days.length === 0) {
    lines.forEach(line => {
      const lineLower = line.toLowerCase();
      if (retargeting.times.length === 0) {
        const found = parseTimesFromText(line);
        found.forEach(t => { if (!retargeting.times.includes(t)) retargeting.times.push(t); });
      }
      if (retargeting.days.length === 0 && (lineLower.includes('dia') || lineLower.includes('prioriz') || lineLower.includes('horario') || lineLower.includes('viernes') || lineLower.includes('sabado') || lineLower.includes('domingo') || lineLower.includes('lunes') || lineLower.includes('martes') || lineLower.includes('miercoles') || lineLower.includes('jueves'))) {
        const found = parseDaysFromText(line);
        found.forEach(d => { if (!retargeting.days.includes(d)) retargeting.days.push(d); });
      }
    });
  }

  // Missing section warnings
  const warnings = [];
  if (!sectionFound.audiencia) warnings.push('No encontré la sección "Audiencia (Target)".');
  if (!sectionFound.referencias) warnings.push('No encontré la sección "Referencias musicales".');
  if (!sectionFound.placements) warnings.push('No encontré la sección "Placements".');
  if (!sectionFound.retargeting) warnings.push('No encontré la sección "Retargeting".');

  // Deduplicate retargeting times
  retargeting.times = [...new Set(retargeting.times)];
  
  // Normalize days order (Lun -> Dom)
  const prioritizedDaysList = ALL_DAYS.filter(d => retargeting.days.includes(d));

  // Default age fallback
  if (!audience.ageRange && audience.age) {
    audience.ageRange = audience.age;
  }

  // Generar frase de retargeting final
  const t1 = retargeting.times[0] || '20:00';
  const t2 = retargeting.times[1] || '03:00';
  const genreStr = references.style[0] || 'música urbana';
  const summarySentence = `Concentrar la inversión entre las ${t1} y las ${t2} para llegar al público cuando más consume ${genreStr.toLowerCase()}.`;

  return {
    title,
    artists,
    subtitle,
    audience,
    references,
    placements,
    retargeting: {
      ...retargeting,
      prioritizedDaysList,
      summarySentence
    },
    unknownBlocks,
    warnings,
    // Highlights metrics for stat cards
    highlights: {
      ageRange: audience.ageRange || '18–34',
      countriesCount: audience.countries.length || 4,
      primaryTime: t1,
      secondaryTimeTag: retargeting.times[1] ? `y ${retargeting.times[1]}, mayor consumo` : 'mayor consumo',
      prioritizedDaysCount: prioritizedDaysList.length || 3
    }
  };
}
