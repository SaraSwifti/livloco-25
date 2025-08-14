// components/MarketCard.jsx
// import Image from 'next/image';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MarketCard = ({ market }) => {
  if (!market) return null;

  const hasImage =
    typeof market.hostfm_profile_image === 'string' &&
    market.hostfm_profile_image.trim() !== '';

  const city = market?.hostfm_address?.city || '';
  // Prefer state_name, then state (legacy), then state_code
  const stateText =
    market?.hostfm_address?.state_name ||
    market?.hostfm_address?.state ||
    market?.hostfm_address?.state_code ||
    '';

  // If you have routes like /markets/[id], this will make the card clickable.
  const Wrapper = ({ children }) =>
    market?._id ? (
      <Link href={`/markets/${market._id}`}>{children}</Link>
    ) : (
      <div role="article">{children}</div>
    );

  return (
    <Wrapper>
      <div className="rounded-xl pt-1 shadow-md relative bg-white">
        <div className="mt-5 flex justify-center items-center">
         <SafeImage
  src={market.hostfm_profile_image}
  alt={`${market.hostfm_name || 'Market'} profile image`}
  sizes="100vw"
  className="h-[200px] w-[300px] rounded-t-xl" // container size
  imgClassName="object-contain"                 // apply to the <img>
  cover={false}                                  // use contain, not cover
  priority={false}
          />
          </div>

        <div className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-3xl font-bold">
              {market.hostfm_name || 'Unnamed Market'}
            </h3>

            {market?.hostfm_type ? (
              <div className="mt-1 text-sm text-gray-600">
                {market.hostfm_type}
              </div>
            ) : null}

            <div className="flex items-center justify-center gap-2 mt-3">
              <FaMapMarkerAlt className="text-orange-700 mt-0.5" />
              <span className="text-black">
                {city}
                {city && stateText ? ', ' : ''}
                {stateText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default MarketCard;