import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/UI/Header';
import NavigationTabs from './components/UI/NavigationTabs';
import ContentEditor from './components/Panels/ContentEditor';
import ImageEditor from './components/Panels/ImageEditor';
import ThemePanel from './components/Panels/ThemePanel';
import ExportPanel from './components/Panels/ExportPanel';
import Report from './components/Report/Report';

import { DEFAULT_MARKDOWN } from './constants/sampleMarkdown';
import { DEFAULT_THEMES } from './constants/defaultThemes';
import { parseMarkdown } from './utils/parseMarkdown';
import { checkThemeContrast } from './utils/themeUtils';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function App() {
  // State lives in React State ONLY (No localStorage, sessionStorage or DB per constraints)
  const [markdownText, setMarkdownText] = useState(DEFAULT_MARKDOWN);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [isVertical, setIsVertical] = useState(true);
  const [isDuotone, setIsDuotone] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [frameShape, setFrameShape] = useState('auto');
  const [layoutMode, setLayoutMode] = useState('auto');

  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState(DEFAULT_THEMES[0].id);
  const [themeColors, setThemeColors] = useState(DEFAULT_THEMES[0].colors);

  // Navigation State
  const [activeTab, setActiveTab] = useState('content');

  // Preview Scale & Zoom State
  const [previewScale, setPreviewScale] = useState(0.45);
  const [reportHeight, setReportHeight] = useState(1950);
  const previewContainerRef = useRef(null);
  const reportRef = useRef(null);

  // Parse Markdown live
  const parsedData = useMemo(() => parseMarkdown(markdownText), [markdownText]);

  // Contrast warning check
  const contrastCheck = useMemo(
    () => checkThemeContrast(themeColors.text, themeColors.bg),
    [themeColors.text, themeColors.bg]
  );

  // Auto calculate preview scale to fit container width smoothly
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 48; // padding
        if (containerWidth > 0) {
          const calculatedScale = Math.min(Math.max(containerWidth / 1600, 0.15), 0.85);
          setPreviewScale(calculatedScale);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Dynamically measure true unscaled report height
  useEffect(() => {
    if (!reportRef.current) return;
    const updateHeight = () => {
      if (reportRef.current) {
        setReportHeight(reportRef.current.offsetHeight || 1950);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(reportRef.current);
    return () => observer.disconnect();
  }, [parsedData, imageDataUrl, layoutMode]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-rose-500 selection:text-white pb-16 lg:pb-0">
      {/* Header */}
      <Header />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side / Mobile Top: Control Panels */}
        <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 shadow-lg flex-shrink-0">
          {/* Navigation Tabs Header */}
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active Panel Content Container */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
            {activeTab === 'content' && (
              <ContentEditor
                markdownText={markdownText}
                setMarkdownText={setMarkdownText}
                warnings={parsedData.warnings}
              />
            )}

            {activeTab === 'image' && (
              <ImageEditor
                imageDataUrl={imageDataUrl}
                setImageDataUrl={setImageDataUrl}
                isVertical={isVertical}
                setIsVertical={setIsVertical}
                isDuotone={isDuotone}
                setIsDuotone={setIsDuotone}
                zoom={zoom}
                setZoom={setZoom}
                panX={panX}
                setPanX={setPanX}
                panY={panY}
                setPanY={setPanY}
                frameShape={frameShape}
                setFrameShape={setFrameShape}
                layoutMode={layoutMode}
                setLayoutMode={setLayoutMode}
                themeColors={themeColors}
                artistName={parsedData.artists || parsedData.title}
              />
            )}

            {activeTab === 'theme' && (
              <ThemePanel
                themeColors={themeColors}
                setThemeColors={setThemeColors}
                currentThemeId={currentThemeId}
                setCurrentThemeId={setCurrentThemeId}
              />
            )}

            {activeTab === 'export' && (
              <ExportPanel
                reportRef={reportRef}
                title={parsedData.title}
                themeBg={themeColors.bg}
              />
            )}
          </div>
        </div>

        {/* Right Side / Mobile Bottom: Live Interactive Scaled Report Preview */}
        <div
          ref={previewContainerRef}
          className="flex-1 bg-zinc-200/80 dark:bg-zinc-950 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto w-full min-h-[500px]"
        >
          {/* Preview Scale Controls & Header */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Vista Previa en Vivo (Póster 1600px)
            </span>

            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewScale((s) => Math.max(s - 0.05, 0.15))}
                className="hover:text-rose-500 transition"
                title="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 min-w-[38px] text-center">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewScale((s) => Math.min(s + 0.05, 1.0))}
                className="hover:text-rose-500 transition"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (previewContainerRef.current) {
                    const availableWidth = previewContainerRef.current.clientWidth - 48;
                    setPreviewScale(Math.min(Math.max(availableWidth / 1600, 0.18), 0.85));
                  }
                }}
                className="hover:text-rose-500 border-l border-zinc-200 dark:border-zinc-700 pl-2 ml-1"
                title="Ajustar a la pantalla"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scaled Poster Container */}
          <div
            className="relative shadow-2xl rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-800 transition-all duration-150 my-2"
            style={{
              width: `${1600 * previewScale}px`,
              height: `${reportHeight * previewScale}px`
            }}
          >
            <div
              style={{
                width: '1600px',
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left'
              }}
            >
              <Report
                ref={reportRef}
                parsedData={parsedData}
                imageDataUrl={imageDataUrl}
                isVertical={isVertical}
                isDuotone={isDuotone}
                zoom={zoom}
                panX={panX}
                panY={panY}
                frameShape={frameShape}
                layoutMode={layoutMode}
                themeColors={themeColors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
