// components/ItemsGrid.jsx

import { ItemIcon } from '@/components/ItemIcon'
import SafeImage from '@/components/SafeImage'

export default function ItemsGrid({ title, entries, keys }) {
  return (
    <section className='p-4 border rounded shadow bg-white'>
      <h2 className='text-xl font-bold tracking-tight text-gray-900 mb-4 text-center'>
        {title}
      </h2>

      {/* 1 col on phones, 2 on small screens, 3 on large */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {keys.map((k) => {
          const it = entries?.[k]
          const hasDesc = (it?.description || '').trim() !== ''
          if (!hasDesc) return null

          return (
            <article
              key={k}
              className='flex flex-col gap-3 h-full'
            >
              {/* IMAGE ON TOP */}
              <SafeImage
                src={it.image}
                alt={it.description || 'Item image'}
                className='w-full overflow-hidden rounded' // wrapper
                // Use one sizing mode:
                // Prefer fill + ratio for nice, even cards:
                ratio='16/9'
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                // If your SafeImage doesn't support `ratio`/`fill`,
                // remove the two lines above and instead pass width/height.
                zoomOnClick //  enable zoom for this image only
                previewSrc={it.image} // optional: explicit preview source (can be same as src)
              />

              {/* TEXT UNDER IMAGE */}
              <div className='flex items-start gap-2'>
                <ItemIcon type={it.type} />
                <div className='flex-1'>
                  <h3 className='text-xl font-medium text-left text-black'>
                    {it.description}
                  </h3>
                  {it.price && (
                    <p className='text-xl font-medium text-gray-900'>
                      {it.price}
                    </p>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
