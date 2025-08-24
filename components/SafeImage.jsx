'use client';

import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'

const fallbackByRatio = {
  '1/1': '/images/image-unavailable1x1.png',
  '16/9': '/images/image-unavailable16x9.png',
  '21/9': '/images/image-unavailable21x9.png',
};

/**
 * A resilient Image wrapper for Next.js
 * - Falls back to a hazy placeholder on error/missing src
 * - Auto-injects Cloudinary transforms (f_auto,q_auto) when using Cloudinary URLs
 * - Supports `fill` layout with aspect-ratio container
 */

export default function SafeImage({
  src,
  alt = '',
  // Layout
  fill = true, // use fill layout by default
  ratio = '16/9', // aspect ratio used when fill=true
  sizes = '(max-width: 640px) 90vw, 300px',
  className = '', // container classes
  imgClassName = '', // actual <img> classes (e.g., object-cover)
  cover = true, // object-fit cover vs contain
  style,

  // Fallbacks
  fallbackSrc, // optional fallback image URL
  fallbackText = 'No image available',

  // Perf / Image props passthrough
  priority = false,
  quality,
  //zoom
  zoomOnClick = false, // NEW: enable click-to-zoom
  previewSrc, // NEW: optional high-res source for modal

  ...rest
}) {
  const [errored, setErrored] = useState(false)
  const [fallbackErrored, setFallbackErrored] = useState(false)

  // reset fallback error whenever inputs change
  useEffect(() => {
    setFallbackErrored(false)
  }, [src, ratio, fallbackSrc]);

   // Zoom modal state + ESC to close
    const [open, setOpen] = useState(false);      
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // If we have no src or it errored, we fall back
  const showFallback = !src || errored;

  // Add Cloudinary "f_auto,q_auto" when using Cloudinary URLs (and not already present)
  const resolvedSrc = useMemo(() => {
    if (!src) return src
    try {
      const u = new URL(src)
      if (u.hostname.endsWith('res.cloudinary.com')) {
        const [before, after] = u.pathname.split('/image/upload/')
        if (after && !after.startsWith('f_') && !after.startsWith('q_')) {
          u.pathname = `${before}/image/upload/f_auto,q_auto/${after}`
          return u.toString()
        }
      }
    } catch {
      // ignore URL parsing errors; just return original src
    }

    return src;
  }, [src]);

   // Decide sizing mode: if caller passes width/height, turn OFF fill to avoid conflict
  const { width: userWidth, height: userHeight, ...imgRest } = rest || {};
  let useFill = !!fill;
  if ((userWidth || userHeight) && fill) {
    useFill = false; // never pass both fill and width/height to <Image>
  };


  // When using fill, wrap in a relative box with aspect-ratio
  const containerStyle = useFill
    ? { position: 'relative', width: '100%', aspectRatio: ratio, ...style }
    : style;

  // Choose fallback (prop > by-ratio > default 16:9)
  const chosenFallback =
    fallbackSrc ?? fallbackByRatio[ratio] ?? '/images/image-unavailable16x9.png';
  
 // ---- Build main element (no early returns) -------------------------------
  let main;

  if (showFallback) {
    main = (
     <div
   className={`relative w-full ${className}`}
   style={{ aspectRatio: ratio, ...style }}
   onClick={zoomOnClick ? openModal : undefined}
 >
        {fallbackErrored ? (
          <div className="flex h-full w-full items-center justify-center border rounded text-gray-500 italic">
            {fallbackText}
          </div>
        ) : (
          <>
            <Image
              src={chosenFallback}
              alt={alt || 'fallback image'}
              fill
              sizes={sizes}
              className={`${cover ? 'object-cover' : 'object-contain'} ${imgClassName} ${zoomOnClick ? 'cursor-zoom-in' : ''}`}
              priority={priority}
              quality={quality}
              onError={() => setFallbackErrored(true)}
              onClick={zoomOnClick ? openModal : undefined}
              {...imgRest}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-2xl px-4 py-2 rounded">
                Image Unavailable
              </span>
            </div>
          </>
        )}
      </div>
    );
  } else if (useFill) {
    main = (
      <div className={`relative w-full ${className}`} style={containerStyle}>
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={`${cover ? 'object-cover' : 'object-contain'} ${imgClassName} ${zoomOnClick ? 'cursor-zoom-in' : ''}`}
          priority={priority}
          quality={quality}
          onError={() => setErrored(true)}
          onClick={zoomOnClick ? openModal : undefined}
          {...imgRest}
        />
      </div>
    );
  } else {
    // Non-fill: ensure width/height exist (fallback to 600x338 ~16:9)
    const w = Number(userWidth) || 600;
    const h = Number(userHeight) || Math.round(w * (9 / 16));
    main = (
      <Image
        src={resolvedSrc}
        alt={alt}
        width={w}
        height={h}
        className={`${imgClassName || className} ${zoomOnClick ? 'cursor-zoom-in' : ''}`}
        priority={priority}
        quality={quality}
        onError={() => setErrored(true)}
        onClick={zoomOnClick ? openModal : undefined}
        {...imgRest}
      />
    );
  }

  // ---- Single return with optional modal overlay ---------------------------
  return (
    <>
      {main}

      {zoomOnClick && open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-black font-semibold shadow hover:bg-white"
            aria-label="Close image preview"
          >
            Close
          </button>

          <div
            className="relative w-[92vw] max-w-6xl h-[80vh] rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewSrc || (showFallback ? chosenFallback : resolvedSrc)}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );


}
