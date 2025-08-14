'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';


const fallbackByRatio = {
  '1/1': '/images/fallback-hazy-1x1.png',
  '16/9': '/images/fallback-hazy-16x9.png',
  '21/9': '/images/fallback-hazy-21x9.png',
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
  fill = true,                // use fill layout by default
  ratio = '16/9',             // aspect ratio used when fill=true
  sizes = '100vw',
  className = '',             // container classes
  imgClassName = '',          // actual <img> classes (e.g., object-cover)
  cover = true,               // object-fit cover vs contain
  style,

  // Fallbacks
  fallbackSrc,                // optional fallback image URL
  fallbackText = 'No image available',

  // Perf / Image props passthrough
  priority = false,
  quality,
  ...rest
}) {
  const [errored, setErrored] = useState(false);
    const [fallbackErrored, setFallbackErrored] = useState(false);

      // reset fallback error whenever inputs change
  useEffect(() => {
    setFallbackErrored(false);
  }, [src, ratio, fallbackSrc]);
    
  // If we have no src or it errored, we fall back
    const showFallback = !src || errored;
   
    // Add Cloudinary "f_auto,q_auto" when using Cloudinary URLs (and not already present)
  const resolvedSrc = useMemo(() => {
    if (!src) return src;
    try {
      const u = new URL(src);
      if (u.hostname.endsWith('res.cloudinary.com')) {
        const [before, after] = u.pathname.split('/image/upload/');
        if (after && !after.startsWith('f_') && !after.startsWith('q_')) {
          u.pathname = `${before}/image/upload/f_auto,q_auto/${after}`;
          return u.toString();
        }
      }
    } catch {
      // ignore URL parsing errors; just return original src
      };



    return src;
  }, [src]);
    
    // When using fill, wrap in a relative box with aspect-ratio
 const containerStyle = fill
   ? { position: 'relative', width: '100%', aspectRatio: ratio, ...style }
        : style;
    
    
      // Choose fallback (prop > by-ratio > default 16:9)
     const chosenFallback =
  fallbackSrc ??
  fallbackByRatio[ratio] ??
 '/images/fallback-hazy-16x9.png';

  // Fallback rendering (always show the hazy image instead of a text box)
  if (showFallback) {
 return (
      <div className={`relative w-full ${className}`} style={{ aspectRatio: ratio, ...style }}>
       {fallbackErrored ? (
          <div className="flex h-full w-full items-center justify-center border rounded text-gray-500 italic">
            {fallbackText}
          </div>
        ) : (
          <Image
            src={chosenFallback}
            alt={alt || 'fallback image'}
            fill
            sizes={sizes}
            className={`${cover ? 'object-cover' : 'object-contain'} ${imgClassName}`}
            priority={priority}
            quality={quality}
            onError={() => setFallbackErrored(true)}
            {...rest}
         />
        )}
      </div>
    );
  }

  // Main image
  return fill ? (
    <div className={`relative w-full ${className}`} style={containerStyle}>
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={`${cover ? 'object-cover' : 'object-contain'} ${imgClassName}`}
        priority={priority}
        quality={quality}
        onError={() => setErrored(true)}
        {...rest}
      />
    </div>
  ) : (
    <Image
      src={resolvedSrc}
      alt={alt}
      // When not using fill, caller should pass width/height
      // (we still allow rest props to override)
      sizes={sizes}
      className={imgClassName || className}
      priority={priority}
      quality={quality}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
