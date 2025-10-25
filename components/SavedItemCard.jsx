'use client'

import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import SaveButton from '@/components/SaveButton'
import MappingPin from '@/components/MappingPin'

/**
 * SavedItemCard component for displaying saved businesses and markets
 * Shows the item with a link to details and an unsave button
 *
 * @param {object} item - The business or market object
 * @param {string} type - Either 'business' or 'market'
 */
const SavedItemCard = ({ item, type }) => {
  if (!item) return null

  const isBusiness = type === 'business'
  const isMarket = type === 'market'

  // Extract common fields
  const id = item._id
  const name = isBusiness ? item.locobiz_name : item.hostfm_name
  const profileImage = isBusiness
    ? item.locobiz_profile_image
    : item.hostfm_profile_image
  const description = isBusiness
    ? item.locobiz_description
    : item.hostfm_description
  const itemType = isBusiness ? item.locobiz_type : item.hostfm_type

  // Check if item is active
  const isActive = isBusiness ? item.locobiz_active : item.hostfm_active

  // Address fields
  const address = isBusiness ? item.locobiz_address : item.hostfm_address
  const city = address?.city || ''
  const stateName =
    address?.state_name || address?.state || address?.state_code || ''
  const memZip = isBusiness
    ? item.mem_zip
    : item.mem_zip || address?.zipcode || address?.zip

  // Link URL (only if active)
  const linkUrl = isActive
    ? isBusiness
      ? `/businesses/${id}`
      : `/hostfarmmarkets/${id}`
    : null

  return (
    <div className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden'>
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
        <div
          className={`relative h-48 w-full bg-gray-900 rounded-t-xl overflow-hidden ${
            !isActive ? 'opacity-60' : ''
          }`}
        >
          <div
            className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900'
            aria-hidden='true'
          />
          <div
            className='absolute inset-0 bg-green-500/10'
            aria-hidden='true'
          />
          {isActive ? (
            <Link
              href={linkUrl}
              className='block h-full w-full'
            >
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
            </Link>
          ) : (
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
          )}
        </div>

        {/* Content Section */}
        <div className='p-4'>
          {/* Name */}
          <header className='mb-2'>
            {isActive ? (
              <Link
                href={linkUrl}
                className='block'
              >
                <h3
                  className='text-lg font-bold text-gray-900 text-center hover:text-blue-600 transition-colors'
                  itemProp='name'
                >
                  {name}
                </h3>
              </Link>
            ) : (
              <h3
                className='text-lg font-bold text-gray-900 text-center'
                itemProp='name'
              >
                {name}
              </h3>
            )}
          </header>

          {/* Rest of content with conditional opacity */}
          <div className={!isActive ? 'opacity-60' : ''}>
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
                className={`text-green-600 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded ${
                  !isActive ? 'text-gray-500 hover:text-gray-500' : ''
                }`}
                mode='modal'
                size='sm'
              />
            </div>

            {/* Inactive Notice */}
            {!isActive && (
              <div className='mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg'>
                <p className='text-sm text-gray-600 text-center font-medium'>
                  This {isBusiness ? 'business' : 'market'} is currently
                  inactive - It could be a seasonal thing.
                </p>
              </div>
            )}

            {/* Unsave Button */}
            <div className='flex justify-center'>
              <SaveButton
                id={id}
                type={type}
                initialHasSaved={true}
                isLoggedIn={true}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default SavedItemCard
