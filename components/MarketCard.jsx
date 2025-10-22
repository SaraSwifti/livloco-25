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
        passHref
      >
        {children}
      </Link>
    ) : (
      <div role='article'>{children}</div>
    )

  return (
    <Wrapper>
      <div className='group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600'>
        <article className='rounded-xl overflow-hidden'>
          {/* Image Section */}
          <div className='relative h-48 w-full bg-gray-900 rounded-t-xl overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900'></div>
            <div className='absolute inset-0 bg-green-500/10'></div>
            <SafeImage
              src={hostfm_profile_image}
              alt={`${hostfm_name} profile image`}
              className='h-full w-full object-cover'
              imgClassName='object-cover'
              cover={true}
              sizes='(max-width: 640px) 90vw, 300px'
              zoomOnClick={false}
            />
          </div>

          {/* Content Section */}
          <div className='p-4'>
            {/* Market Name */}
            <h3 className='text-lg font-bold text-gray-900 mb-2 text-center'>
              {hostfm_name}
            </h3>

            {/* Market Type */}
            {hostfm_type && (
              <div className='text-sm text-gray-600 mb-2 text-center'>
                {hostfm_type}
              </div>
            )}

            {/* Location */}
            <div className='flex items-center justify-center gap-1 mb-4'>
              <MappingPin
                memZip={
                  market?.mem_zip ||
                  hostfm_address?.zipcode ||
                  hostfm_address?.zip
                }
                city={city}
                stateName={stateText}
                className='text-green-600 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-green-700'
                mode='modal'
                size='sm'
              />
            </div>

            {/* Distance indicator */}
            {market?.distance !== null && market?.distance !== undefined && (
              <div className='text-xs text-black mb-3 text-center'>
                {formatDistance(market.distance)} away
              </div>
            )}
          </div>
        </article>
      </div>
    </Wrapper>
  )
}

export default MarketCard
