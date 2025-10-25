// components/BusinessHeaderImage.jsx
import SafeImage from './SafeImage'

export default function BusinessHeaderImage({ locobiz }) {
  const alt = locobiz?.locobiz_name
    ? `${locobiz.locobiz_name} header`
    : 'Business header'
  const src = locobiz?.locobiz_profile_image

  return (
    <section className='py-4'>
      {/* scaled to match body width */}
      <div className='max-w-4xl mx-auto px-4'>
        <div className='relative overflow-hidden sm:rounded-xl border-4 border-black shadow-2xl'>
          <SafeImage
            src={src}
            alt={alt}
            ratio='16/9' // smaller hero like markets
            sizes='(min-width: 1024px) 1024px, 100vw' // align with max-w-4xl
            priority
          />
          {/* optional top fade for contrast (keep or remove) */}
          <div className='absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent pointer-events-none' />
          <h1
            className='
              absolute
              left-4 sm:left-6 md:left-8
              bottom-3 sm:bottom-5 md:bottom-7
              z-10 text-left
              text-white font-bold text-[clamp(28px,6vw,64px)]
              [-webkit-text-stroke:1.5px_black]
              [text-shadow:_-1px_0_#000,0_1px_#000,1px_0_#000,0_-1px_#000,_-1px_-1px_0_#000,1px_1px_0_#000,-1px_1px_0_#000,1px_-1px_0_#000]
              pointer-events-none
            '
          >
            {locobiz?.locobiz_name ?? 'Business'}
          </h1>
        </div>
      </div>
    </section>
  )
}
