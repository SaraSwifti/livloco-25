'use client'

import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import PropTypes from 'prop-types'
import React from 'react'
import MappingPin from '@/components/MappingPin'
import { incrementBusinessClickAction } from '@/app/actions/incrementBusinessClickAction'
import { formatDistance } from '@/utils/location'

const hasText = (s) => typeof s === 'string' && s.trim().length > 0

const EntryList = ({ label, root, keys }) => {
  const items = keys
    .map((k) => root?.[k])
    .filter(Boolean)
    .filter((entry) => hasText(entry?.description))

  if (items.length === 0) return null

  return (
    <section className='text-2xl text-black mb-4'>
      <div className='border border-gray-500 p-4 mb-5 rounded-xl'>
        <p className='font-bold mb-2'>{label}</p>
        {items.map((entry, idx) => (
          <div
            key={idx}
            className='flex items-start gap-2 mb-2'
          >
            <p className='leading-snug'>{entry?.description?.trim()}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const SELL_KEYS = ['selling1', 'selling2', 'selling3']
const NEED_KEYS = ['need1', 'need2', 'need3']

const BusinessCard = React.memo(function BusinessCard({ locobiz }) {
  if (!locobiz) return null

  const id = locobiz?._id
  const name = locobiz?.locobiz_name || 'Business'
  const profileImage = locobiz?.locobiz_profile_image
  const city = locobiz?.locobiz_address?.city
  const stateName = locobiz?.locobiz_address?.state_name

  const handleCardClick = async () => {
    if (id) {
      try {
        await incrementBusinessClickAction(id)
      } catch (error) {
        console.error('Failed to track click:', error)
        // Don't block navigation on error
      }
    }
  }

  return (
    <Link
      onClick={handleCardClick}
      href={`/businesses/${id}`}
      className='group block rounded-xl shadow-md bg-white

              border-4 border-black ring-1 ring-black/20

              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600'
    >
      <article className='rounded-xl pt-1'>
        <div className='mt-5 flex justify-center items-center'>
          <SafeImage
            src={profileImage}
            alt={`${name} profile image`}
            className='h-[200px] w-[300px] rounded-t-xl pointer-events-none'
            imgClassName='object-contain'
            cover={false}
            sizes='(max-width: 640px) 90vw, 300px'
            zoomOnClick={false}
          />
        </div>

        <div className='p-4'>
          <header className='text-center mb-6'>
            <h3 className='text-3xl font-bold'>{name}</h3>
            {locobiz?.distance && (
              <div className='text-sm text-blue-600 font-medium mb-2'>
                📍 {formatDistance(locobiz.distance)} away
              </div>
            )}
            <MappingPin
              memZip={locobiz?.mem_zip}
              city={city}
              stateName={stateName}
              className='justify-center text-xl font-bold mt-2 text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4'
              mode='modal' // or "link" for new tab
              size='md'
              // stopPropagation defaults to true — so clicking the pin won’t navigate
            />
          </header>

          <EntryList
            label='Selling:'
            root={locobiz?.selling}
            keys={SELL_KEYS}
          />
          <EntryList
            label='Needing:'
            root={locobiz?.needs}
            keys={NEED_KEYS}
          />
        </div>
      </article>
    </Link>
  )
})

EntryList.propTypes = {
  label: PropTypes.string.isRequired,
  root: PropTypes.object,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
}
BusinessCard.propTypes = {
  locobiz: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    locobiz_name: PropTypes.string,
    locobiz_profile_image: PropTypes.string,
    locobiz_address: PropTypes.shape({
      city: PropTypes.string,
      state_name: PropTypes.string,
    }),
    selling: PropTypes.object,
    needs: PropTypes.object,
  }),
}

export default BusinessCard
