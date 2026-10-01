import React, { useEffect, useRef } from 'react';
import { applyDuotoneToCanvas } from '../../utils/imageUtils';

export default function DuotoneCanvas({
  imageDataUrl,
  isDuotone,
  themeColors,
  zoom = 1,
  panX = 0,
  panY = 0,
  frameShape = 'auto', // 'arco' | 'rounded' | 'square' | 'auto'
  isVertical = true,
  artistName = 'Perfil del público objetivo',
  onMouseDown,
  onTouchStart
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  // Apply duotone when image or theme changes
  useEffect(() => {
    if (!isDuotone || !imageDataUrl || !imgRef.current) return;
    const img = imgRef.current;
    if (img.complete) {
      applyDuotoneToCanvas(canvasRef.current, img, themeColors);
    } else {
      img.onload = () => {
        applyDuotoneToCanvas(canvasRef.current, img, themeColors);
      };
    }
  }, [imageDataUrl, isDuotone, themeColors]);

  if (!imageDataUrl) return null;

  // Determine actual shape class or inline style
  let shapeStyle = 'rounded-2xl'; // default
  if (frameShape === 'arco' || (frameShape === 'auto' && isVertical)) {
    shapeStyle = 'rounded-t-[215px] rounded-b-[14px]';
  } else if (frameShape === 'rounded' || (frameShape === 'auto' && !isVertical)) {
    shapeStyle = 'rounded-tl-[14px] rounded-tr-[120px] rounded-b-[14px]';
  } else if (frameShape === 'square') {
    shapeStyle = 'rounded-[14px]';
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing border-2 border-zinc-900/10 shadow-xl select-none ${shapeStyle}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Hidden original image used for duotone processing canvas */}
      <img
        ref={imgRef}
        src={imageDataUrl}
        alt="Artist original"
        className="hidden"
        crossOrigin="anonymous"
      />

      {/* Render Image or Canvas */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden bg-zinc-950">
        {isDuotone ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-transform duration-75"
            style={{
              transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <img
            src={imageDataUrl}
            alt="Artist preview"
            className="w-full h-full object-cover transition-transform duration-75"
            style={{
              transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'center center'
            }}
          />
        )}
      </div>

      {/* Bottom 1/3 dark gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* Artist Badge Overlay Tag */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider truncate">
          {artistName || 'Perfil del público objetivo'}
        </span>
      </div>
    </div>
  );
}
