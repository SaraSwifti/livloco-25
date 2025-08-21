// components/MarketCard.jsx
// components/MarketCard.jsx

import SafeImage from '@/components/SafeImage'
import Link from 'next/link'
import { FaMapMarkerAlt } from 'react-icons/fa'

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

  // Abstracted wrapper (link if _id exists, div otherwise)
  const Wrapper = ({ children }) =>
    _id ? (
      <Link href={`/markets/${_id}`} passHref>
        {children}
      </Link>
    ) : (
      <div role="article">{children}</div>
    )

  return (
    <Wrapper>
      <div className="rounded-xl pt-1 shadow-md relative bg-white">
        <div className="mt-5 flex justify-center items-center rounded-t-xl">
          <SafeImage
            src={hostfm_profile_image}
            alt={`${hostfm_name} profile image`}
            className="h-[200px] w-[300px] rounded-t-xl"
            imgClassName="object-contain"
            cover={false}
             sizes="(max-width: 640px) 90vw, 300px"
          />
        </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-3xl font-bold">{hostfm_name}</h3>

            {hostfm_type && (
              <div className="mt-1 text-sm text-gray-600">{hostfm_type}</div>
            )}

            {location && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <FaMapMarkerAlt className="text-orange-700 mt-0.5" />
                <span className="text-black">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default MarketCard

