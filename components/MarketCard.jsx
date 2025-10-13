// components/MarketCard.jsx
'use client'

import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import MappingPin from '@/components/MappingPin';
import { incrementMarketClickAction } from '@/app/actions/incrementMarketClickAction';

const MarketCard = ({ market }) => {
  if (!market) return null;

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
        await incrementMarketClickAction(_id);
      } catch (error) {
        console.error('Failed to track click:', error);
        // Don't block navigation on error
      }
    }
  };

  // Abstracted wrapper (link if _id exists, div otherwise)
  const Wrapper = ({ children }) =>
    _id ? (
      <Link href={`/hostfarmmarkets/${_id}`} onClick={handleCardClick} passHref>
        {children}
      </Link>
    ) : (
      <div role="article">{children}</div>
    )

  return (
    <Wrapper>
      <div className="rounded-xl pt-1 shadow-md relative bg-white ring-1 border-4 border-black ring-black/20">
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

<MappingPin
  // try mem_zip; fall back to common zip fields for markets
  memZip={market?.mem_zip || hostfm_address?.zipcode || hostfm_address?.zip}
  city={city}
  stateName={stateText}
  className="justify-center mt-3 text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
  mode="modal"     // or "link" to open Google Maps in a new tab
  size="md"
  // stopPropagation defaults to true — so the card's <Link> won't trigger
/>

          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default MarketCard

