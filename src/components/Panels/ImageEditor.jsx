import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, Camera, RefreshCw } from 'lucide-react';
import { processUploadedImage } from '../../utils/imageUtils';
import CropControls from '../Image/CropControls';
import DuotoneCanvas from '../Image/DuotoneCanvas';

export default function ImageEditor({
  imageDataUrl,
  setImageDataUrl,
  isVertical,
  setIsVertical,
  isDuotone,
  setIsDuotone,
  zoom,
  setZoom,
  panX,
  setPanX,
  panY,
  setPanY,
  frameShape,
  setFrameShape,
  layoutMode,
  setLayoutMode,
  themeColors,
  artistName
}) {
  const fileInputRef = useRef(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPanDragging, setIsPanDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await loadFile(file);
    e.target.value = '';
  };

  const loadFile = async (file) => {
    try {
      const processed = await processUploadedImage(file);
      setImageDataUrl(processed.dataUrl);
      setIsVertical(processed.isVertical);
      setZoom(1.0);
      setPanX(0);
      setPanY(0);
    } catch (err) {
      alert(err.message || 'No se pudo cargar la imagen.');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await loadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  // Pan dragging inside photo frame preview
  const handleMouseDown = (e) => {
    setIsPanDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isPanDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsPanDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsPanDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isPanDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsPanDragging(false);
  };

  const resetCrop = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="space-y-4" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            Foto del Artista
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sube la imagen del artista. Se procesará 100% en memoria en tu navegador.
          </p>
        </div>

        {imageDataUrl && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Quitar
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/heic"
        onChange={handleFileChange}
        className="hidden"
      />

      {!imageDataUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
            isDraggingFile
              ? 'border-rose-500 bg-rose-500/10 scale-[0.99]'
              : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:border-rose-400 hover:bg-rose-500/5'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Haz clic para subir o arrastra la foto aquí
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              JPG, PNG, WEBP o HEIC (Max 2000px auto-reducido)
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs shadow hover:bg-rose-700 transition"
          >
            <Camera className="w-4 h-4" />
            Elegir foto o cámara
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interactive Frame Box Preview */}
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 font-medium">
              Previsualización y Encuadre (Arrastra para reencuadrar):
            </p>
            <div className="w-full max-w-sm mx-auto aspect-[3/4] p-2 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
              <DuotoneCanvas
                imageDataUrl={imageDataUrl}
                isDuotone={isDuotone}
                themeColors={themeColors}
                zoom={zoom}
                panX={panX}
                panY={panY}
                frameShape={frameShape}
                isVertical={isVertical}
                artistName={artistName}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />
            </div>
          </div>

          <CropControls
            zoom={zoom}
            setZoom={setZoom}
            isDuotone={isDuotone}
            setIsDuotone={setIsDuotone}
            frameShape={frameShape}
            setFrameShape={setFrameShape}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            resetCrop={resetCrop}
          />
        </div>
      )}
    </div>
  );
}
