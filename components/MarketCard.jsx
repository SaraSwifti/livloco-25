// components/MarketCard.jsx
'use client'

import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import { FaMapMarkerAlt } from 'react-icons/fa'
import MappingPin from '@/components/MappingPin'
import { incrementMarketClickAction } from '@/app/actions/incrementMarketClickAction'
import { formatDistance } from '@/utils/location'

const MarketCard = ({ market }) => {
  if (!market) return null

  const {
    _id,
    hostfm_name = 'Unnamed Market',
    hostfm_type,
    hostfm_profile_image,
    hostfm_address = {},
  } = market

  const { city = '', state_name, state, state_code } = hostfm_address
  const stateText = state_name || state || state_code || ''
  const location = [city, stateText].filter(Boolean).join(', ')

  const handleCardClick = async () => {
    if (_id) {
      try {
        await incrementMarketClickAction(_id)
      } catch (error) {
        console.error('Failed to track click:', error)
        // Don't block navigation on error
      }
    }
  }

  // Abstracted wrapper (link if _id exists, div otherwise)
  const Wrapper = ({ children }) =>
    _id ? (
      <Link
        href={`/hostfarmmarkets/${_id}`}
        onClick={handleCardClick}
        className='group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 focus-visible:shadow-xl'
        aria-label={`View details for ${hostfm_name} market`}
      >
        {children}
      </Link>
    ) : (
      <div
        className='group block bg-white rounded-xl shadow-lg transition-all duration-300'
        role='article'
        aria-label={`${hostfm_name} market information`}
      >
        {children}
      </div>
    )

  return (
    <Wrapper>
      <article
        className='rounded-xl overflow-hidden'
        itemScope
        itemType='https://schema.org/FarmersMarket'
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
            src={hostfm_profile_image}
            alt={`${hostfm_name} market profile image`}
            className='h-full w-full object-cover'
            imgClassName='object-cover'
            cover={true}
            sizes='(max-width: 640px) 90vw, 300px'
            zoomOnClick={false}
            itemProp='image'
          />
        </div>

        {/* Content Section */}
        <div className='p-4'>
          {/* Market Name */}
          <header className='mb-2'>
            <h3
              className='text-lg font-bold text-gray-900 text-center'
              itemProp='name'
            >
              {hostfm_name}
            </h3>
          </header>

          {/* Market Type */}
          {hostfm_type && (
            <div
              className='text-sm text-gray-600 mb-2 text-center'
              itemProp='description'
            >
              {hostfm_type}
            </div>
          )}

          {/* Location */}
          <div
            className='flex items-center justify-center gap-1 mb-4'
            aria-label='Market location'
          >
            <MappingPin
              memZip={
                market?.mem_zip ||
                hostfm_address?.zipcode ||
                hostfm_address?.zip
              }
              city={city}
              stateName={stateText}
              className='text-green-600 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded'
              mode='modal'
              size='sm'
            />
          </div>

          {/* Distance indicator */}
          {market?.distance !== null && market?.distance !== undefined && (
            <div
              className='text-xs text-gray-600 mb-3 text-center'
              aria-label={`Distance: ${formatDistance(market.distance)}`}
            >
              <span aria-hidden='true'>📍</span>
              <span className='ml-1'>
                {formatDistance(market.distance)} away
              </span>
            </div>
          )}
        </div>
      </article>
    </Wrapper>
  )
}

export default MarketCard
