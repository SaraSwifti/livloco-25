'use client'

import { useEffect, useMemo, useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'

export default function MappingPin({
  memZip,
  city: cityProp,
  stateName: stateProp,
  className = '',
  mode = 'modal', // 'modal' (popup) or 'link' (new tab)
  size = 'md', // 'sm' | 'md' | 'lg'
  children, //custom trigger
  stopPropagation = true, //isolate click events inside cards
}) {
  const zip = (memZip || '').toString().trim()

  const [city, setCity] = useState(cityProp || '')
  const [state, setState] = useState(stateProp || '')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [open, setOpen] = useState(false)

  // If city/state missing, look them up from ZIP (client-side)
    useEffect(() => {
        let ignore = false
        async function run() {
            if ((cityProp && stateProp) || !zip || zip.length < 5) return
            try {
                const r = await fetch(`https://api.zippopotam.us/us/${zip}`)
                if (!r.ok) return
                const data = await r.json()
                const p = data?.places?.[0]
                if (!ignore && p) {
                    setCity(cityProp || p['place name'] || '')
                    setState(stateProp || p['state'] || '')
                    setLat(parseFloat(p['latitude']))
                    setLng(parseFloat(p['longitude']))
                }
            } catch {
                /* ignore */
            }
        }
        run()
        return () => {
            ignore = true
        }
    }, [zip, cityProp, stateProp]);

    const label =
        city || state ? `${city}${city && state ? ', ' : ''}${state}` : zip || '—';

    const mapEmbedUrl = useMemo(() => {
        if (lat && lng)
            return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=8&output=embed`
        if (zip)
            return `https://www.google.com/maps?q=${encodeURIComponent(
                zip
            )}&hl=en&z=8&output=embed`
        return ''
    }, [lat, lng, zip]);

    const mapLink = useMemo(() => {
        if (lat && lng)
            return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        if (zip)
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                zip
            )}`
        return ''
    }, [lat, lng, zip]);

    const handleTriggerClick = (e) => {
        if (stopPropagation && e) {
            e.preventDefault()
            e.stopPropagation()
        }
        if (mode === 'link') {
            if (mapLink) window.open(mapLink, '_blank', 'noopener,noreferrer')
        } else {
            if (mapEmbedUrl) setOpen(true)
        }
    };
 const handleBackdropClick = (e) => {
   // prevent click-through to underlying <Link>
   e.preventDefault();
   e.stopPropagation();
   setOpen(false);
 };

 const handleCloseBtn = (e) => {
   e.preventDefault();
   e.stopPropagation();
   setOpen(false);
 };

  const sizeCls =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'

  return (
    <>
      {children ? (
        // Custom trigger (e.g., wrap the <h1> name)
        <span
          className={`${className} cursor-pointer`}
          role='button'
          tabIndex={0}
          title={`Open map for ${label}`}
          onClick={handleTriggerClick}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && handleTriggerClick(e)
          }
          aria-label={`Open map for ${label}`}
        >
          {children}
        </span>
      ) : (
        // Default inline pin label trigger
        <div
          className={`inline-flex items-center gap-2 ${sizeCls} ${className} ${
            mapEmbedUrl || mapLink ? 'cursor-pointer' : 'opacity-60'
          }`}
          role='button'
          tabIndex={0}
          title={`Open map for ${label}`}
          onClick={handleTriggerClick}
          onKeyDown={(e) =>
            (e.key === 'Enter' || e.key === ' ') && handleTriggerClick(e)
          }
          aria-label={`Open map for ${label}`}
        >
          <FaMapMarkerAlt
            aria-hidden='true'
            className='text-orange-700 mt-0.5'
          />
          <span className='underline decoration-dotted underline-offset-4'>
            {label}
          </span>
        </div>
      )}

      {mode === 'modal' && open && mapEmbedUrl && (
       <div
   className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
   role="dialog"
   aria-modal="true"
   onMouseDown={handleBackdropClick}
   onClick={handleBackdropClick}>
 
          <div
            className='relative bg-white rounded-xl shadow-xl w-full max-w-3xl h-[70vh] overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              onClick={handleCloseBtn}
              className='absolute top-2 right-2 rounded-full bg-black/70 text-white px-3 py-1'
              aria-label='Close map'
            >
              Close
            </button>
            <iframe
              src={mapEmbedUrl}
              title={`Map for ${label}`}
              className='w-full h-full'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
