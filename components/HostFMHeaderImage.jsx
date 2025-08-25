// components/HostFMHeaderImage.jsx
'use client';

import SafeImage from '@/components/SafeImage';

export default function HostFMHeaderImage({ market }) {
  const alt = market?.hostfm_name ? `${market.hostfm_name} header` : 'Market header';
  const src = market?.hostfm_profile_image;

  return (
    <section className="py-4">
      {/* scaled to match body width */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden sm:rounded-xl ring-1 ring-black/10 shadow-2xl">
          {/* image (scaled, not full-bleed) */}
          <SafeImage
            src={src}
            alt={alt}
            ratio="16/9"                                      // smaller hero
            sizes="(min-width: 1280px) 1280px, 100vw"         // match max-w-6xl
            priority
          />

          {/* top fade for contrast */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

          {/* title bottom-left with stroke/shadow */}
          <h1
            className="
              absolute
              left-4 sm:left-6 md:left-8
              bottom-3 sm:bottom-5 md:bottom-7
              z-10 text-left
              text-white font-bold text-[clamp(28px,6vw,64px)]
              [-webkit-text-stroke:1.5px_black]
              [text-shadow:_-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000,_-1px_-1px_0_#000,1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000]
              pointer-events-none
            "
          >
            {market?.hostfm_name ?? 'Market'}
          </h1>
        </div>
      </div>
    </section>
  );
}

