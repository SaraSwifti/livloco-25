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
  const profileImage = isBusiness ? item.locobiz_profile_image : item.hostfm_profile_image
  const description = isBusiness ? item.locobiz_description : item.hostfm_description
  const itemType = isBusiness ? item.locobiz_type : item.hostfm_type

  // Address fields
  const address = isBusiness ? item.locobiz_address : item.hostfm_address
  const city = address?.city || ''
  const stateName = address?.state_name || address?.state || address?.state_code || ''
  const memZip = isBusiness ? item.mem_zip : (item.mem_zip || address?.zipcode || address?.zip)

  // Link URL
  const linkUrl = isBusiness ? `/businesses/${id}` : `/hostfarmmarkets/${id}`

  return (
    <div className="bg-white rounded-xl shadow-md border-4 border-black ring-1 ring-black/20 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={linkUrl} className="block">
        <div className="mt-5 flex justify-center items-center">
          <SafeImage
            src={profileImage}
            alt={`${name} profile image`}
            className="h-[200px] w-[300px] rounded-t-xl"
            imgClassName="object-contain"
            cover={false}
            sizes="(max-width: 640px) 90vw, 300px"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={linkUrl} className="block mb-3">
          <h3 className="text-2xl font-bold text-center mb-1 hover:text-blue-600 transition-colors">
            {name}
          </h3>
          {itemType && (
            <p className="text-sm text-gray-600 text-center">{itemType}</p>
          )}
          {description && (
            <p className="text-sm text-gray-700 text-center mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </Link>

        {/* Location */}
        <div className="flex justify-center mb-3">
          <MappingPin
            memZip={memZip}
            city={city}
            stateName={stateName}
            className="justify-center text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
            mode="modal"
            size="sm"
          />
        </div>

        {/* Unsave Button */}
        <div className="flex justify-center mt-auto">
          <SaveButton
            id={id}
            type={type}
            initialHasSaved={true}
            isLoggedIn={true}
          />
        </div>
      </div>
    </div>
  )
}

export default SavedItemCard
