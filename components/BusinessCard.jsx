import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { FaMapMarkerAlt, FaClipboardList, FaDollyFlatbed } from 'react-icons/fa';
import PropTypes from 'prop-types';
import React from 'react';

const TypeIcon = ({ type }) => {
  if (type === 'product') return <FaDollyFlatbed aria-hidden="true" className="mt-0.5" />;
  if (type === 'service') return <FaClipboardList aria-hidden="true" className="mt-0.5" />;
  return null;
};

const hasText = (s) => typeof s === 'string' && s.trim().length > 0;

const EntryList = ({ label, root, keys }) => {
  const items = keys
    .map((k) => root?.[k])
    .filter(Boolean)
    .filter((entry) => hasText(entry?.description));

  if (items.length === 0) return null;

  return (
    <section className="text-2xl text-black mb-4">
      <div className="border border-gray-500 p-4 mb-5 rounded-xl">
        <p className="font-bold mb-2">{label}</p>
        {items.map((entry, idx) => (
          <div key={idx} className="flex items-start gap-2 mb-2">
            <TypeIcon type={entry?.type} />
            <p className="leading-snug">{entry?.description?.trim()}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SELL_KEYS = ['selling1', 'selling2', 'selling3'];
const NEED_KEYS = ['need1', 'need2', 'need3'];

const BusinessCard = React.memo(function BusinessCard({ locobiz }) {
  if (!locobiz) return null;

  const id = locobiz?._id;
  const name = locobiz?.locobiz_name || 'Business';
  const profileImage = locobiz?.locobiz_profile_image;
  const city = locobiz?.locobiz_address?.city;
  const stateName = locobiz?.locobiz_address?.state_name;

  return (
    <Link
      href={`/businesses/${id}`}
      className="group block rounded-xl shadow-md bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
    >
      <article className="rounded-xl pt-1">
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

        <div className="p-4">
          <header className="text-center mb-6">
            <h3 className="text-3xl font-bold">{name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <FaMapMarkerAlt aria-hidden="true" className="text-orange-700 mt-0.5" />
              <span className="text-black">
                {city || '—'}
                {city && stateName ? ', ' : ''}
                {stateName || ''}
              </span>
            </div>
          </header>

          <EntryList label="Selling:" root={locobiz?.selling} keys={SELL_KEYS} />
          <EntryList label="Needing:" root={locobiz?.needs} keys={NEED_KEYS} />
        </div>
      </article>
    </Link>
  );
});

TypeIcon.propTypes = { type: PropTypes.string };
EntryList.propTypes = {
  label: PropTypes.string.isRequired,
  root: PropTypes.object,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
};
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
};

export default BusinessCard;
