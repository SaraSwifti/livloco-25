'use client'

import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import PropTypes from 'prop-types'
import React from 'react'
import MappingPin from '@/components/MappingPin'
import CardSaveButton from '@/components/CardSaveButton'
import { incrementBusinessClickAction } from '@/app/actions/incrementBusinessClickAction'
import { formatDistance } from '@/utils/location'

const hasText = (s) => typeof s === 'string' && s.trim().length > 0

const EntryList = ({ label, root, keys, isSelling = false }) => {
  const items = keys
    .map((k) => root?.[k])
    .filter(Boolean)
    .filter((entry) => hasText(entry?.description))

  if (items.length === 0) return null

  const bulletColor = isSelling ? 'bg-green-500' : 'bg-orange-500'
  const ariaLabel = isSelling ? 'Items for sale' : 'Items needed'

  return (
    <section
      className='mb-4'
      aria-label={ariaLabel}
    >
      <header className='flex items-center gap-2 mb-2'>
        <div
          className={`w-2 h-2 rounded-full ${bulletColor}`}
          aria-hidden='true'
        />
        <h4 className='font-bold text-base text-black'>{label}</h4>
      </header>
      <ul
        className='ml-4 space-y-1'
        role='list'
      >
        {items.map((entry, idx) => (
          <li
            key={idx}
            className='text-black text-sm leading-relaxed'
          >
            {entry?.description?.trim()}
          </li>
        ))}
      </ul>
    </section>
  )
}

const SELL_KEYS = ['selling1', 'selling2', 'selling3']
const NEED_KEYS = ['need1', 'need2', 'need3']

const BusinessCard = React.memo(function BusinessCard({
  locobiz,
  isLoggedIn = false,
  hasSaved = false,
}) {
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
      className='group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 focus-visible:shadow-xl'
      aria-label={`View details for ${name} business`}
    >
      <article
        className='rounded-xl overflow-hidden'
        itemScope
        itemType='https://schema.org/LocalBusiness'
      >
        {/* Image Section */}
        <div className='relative h-48 w-full bg-gray-900 rounded-t-xl overflow-hidden'>
          <div
            className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900'
            aria-hidden='true'
          />
          <div
            className='absolute inset-0 bg-green-500/10'
            aria-hidden='true'
          />
          <SafeImage
            src={profileImage}
            alt={`${name} business profile image`}
            className='h-full w-full object-cover'
            imgClassName='object-cover'
            cover={true}
            sizes='(max-width: 640px) 90vw, 300px'
            zoomOnClick={false}
            itemProp='image'
          />

          {/* Save Button */}
          <CardSaveButton
            id={id}
            type='business'
            isLoggedIn={isLoggedIn}
            initialHasSaved={hasSaved}
          />
        </div>

        {/* Content Section */}
        <div className='p-4'>
          {/* Business Name */}
          <header className='mb-2'>
            <h3
              className='text-lg font-bold text-gray-900 text-center'
              itemProp='name'
            >
              {name}
            </h3>
          </header>

          {/* Location */}
          <div
            className='flex items-center justify-center gap-1 mb-4'
            aria-label='Business location'
          >
            <MappingPin
              memZip={locobiz?.mem_zip}
              city={city}
              stateName={stateName}
              className='text-green-600 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded'
              mode='modal'
              size='sm'
            />
          </div>

          {/* Distance indicator */}
          {locobiz?.distance !== null && locobiz?.distance !== undefined && (
            <div
              className='text-xs text-gray-600 mb-3 text-center'
              aria-label={`Distance: ${formatDistance(locobiz.distance)}`}
            >
              <span aria-hidden='true'>📍</span>
              <span className='ml-1'>
                {formatDistance(locobiz.distance)} away
              </span>
            </div>
          )}

          {/* Selling Section */}
          <EntryList
            label='Selling'
            root={locobiz?.selling}
            keys={SELL_KEYS}
            isSelling={true}
          />

          {/* Needing Section */}
          <EntryList
            label='Needing'
            root={locobiz?.needs}
            keys={NEED_KEYS}
            isSelling={false}
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
  isSelling: PropTypes.bool,
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
  isLoggedIn: PropTypes.bool,
  hasSaved: PropTypes.bool,
}

export default BusinessCard
