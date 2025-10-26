'use client'

import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import MappingPin from '@/components/MappingPin'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

const MemberCard = ({ member }) => {
  const { data: session } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!member) return null

  const isBusiness = member.type === 'business'
  const isMarket = member.type === 'market'

  // Extract common fields
  const id = member._id
  const name = isBusiness ? member.locobiz_name : member.hostfm_name
  const profileImage = isBusiness
    ? member.locobiz_profile_image
    : member.hostfm_profile_image
  const description = isBusiness ? member.locobiz_description : null
  const itemType = isBusiness ? member.locobiz_type : member.hostfm_type

  // Address fields
  const address = isBusiness ? member.locobiz_address : member.hostfm_address
  const city = address?.city || ''
  const stateName =
    address?.state_name || address?.state || address?.state_code || ''
  const memZip = isBusiness
    ? member.mem_zip
    : member.mem_zip || address?.zipcode || address?.zip

  // Link URL
  const linkUrl = isBusiness ? `/businesses/${id}` : `/hostfarmmarkets/${id}`

  const handleCardClick = (e) => {
    if (!session) {
      e.preventDefault()
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <Link
        href={linkUrl}
        onClick={handleCardClick}
        className='group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 focus-visible:shadow-xl'
        aria-label={`View details for ${name} ${
          isBusiness ? 'business' : 'market'
        }`}
      >
        <article
          className='rounded-xl overflow-hidden'
          itemScope
          itemType={
            isBusiness
              ? 'https://schema.org/LocalBusiness'
              : 'https://schema.org/FarmersMarket'
          }
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
              alt={`${name} profile image`}
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
            {/* Name */}
            <header className='mb-2'>
              <h3
                className='text-lg font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors'
                itemProp='name'
              >
                {name}
              </h3>
            </header>

            {/* Type */}
            {itemType && (
              <div
                className='text-sm text-gray-600 mb-2 text-center'
                itemProp='description'
              >
                {itemType}
              </div>
            )}

            {/* Description */}
            {description && (
              <div className='text-sm text-gray-700 mb-4 text-center line-clamp-2'>
                {description}
              </div>
            )}

            {/* Location */}
            <div
              className='flex items-center justify-center gap-1 mb-4'
              aria-label={`${isBusiness ? 'Business' : 'Market'} location`}
            >
              <MappingPin
                memZip={memZip}
                city={city}
                stateName={stateName}
                className='text-green-600 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded'
                mode='modal'
                size='sm'
              />
            </div>
          </div>
        </article>
      </Link>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Sign In Required
            </h3>
            <p className='text-gray-600 mb-6'>
              Please sign in or become a livloco co-op member to access the details of this{' '}
              {isBusiness ? 'LocoBusiness' : 'LocoMarket'}.
            </p>
            <div className='flex gap-3'>
              <Link
                href='/api/auth/signin'
                className='flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors'
              >
                Sign In
              </Link>
              <Link
                href='/api/auth/signin'
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors'
              >
                Join Livloco Co-op
              </Link>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className='mt-3 w-full text-gray-500 hover:text-gray-700 text-sm'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MemberCard
