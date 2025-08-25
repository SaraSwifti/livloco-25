// app/hostfarmmarkets/[id]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

import hostfmarkets from '@/app/hostfmarkets.json';

import HostFMHeaderImage from '@/components/HostFMHeaderImage';
import HostFMarketWeeklySch from '@/components/HostFMarketWeeklySch';
import HostFMarketRandomDates from '@/components/HostFMarketRandomDates';
import HostFMStallInfo from '@/components/HostFMStallInfo';
import MappingPin from '@/components/MappingPin';
import AddressLink from '@/components/AddressLink';

const toBool = (v) =>
  v === true || (typeof v === 'string' && v.trim().toLowerCase() === 'true') || v === 1;

const cleanPhone = (p) => (p ? String(p).replace(/[^\d]/g, '') : '');
const formatPhone = (p) => {
  const d = cleanPhone(p);
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return p || '';
};
const normalizeUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
};

export default async function HostFarmMarketPage({ params }) {
  const { id } = await params;

  // JSON lookup (ids in file are numbers)
  const market = hostfmarkets.find((m) => String(m._id) === String(id));
  if (!market) return notFound();

  const weekly = market?.hostfm_weekly_sched ?? {};
  const hasWeekly = toBool(weekly?.weekly_sched);

  const randomDatesObj = market?.hostfm_dates ?? {};
  const hasRandom = toBool(randomDatesObj?.hostfm_randomdates);

  const showWeekly = hasWeekly;
  const showRandom = !hasWeekly && hasRandom;

  const addr = market?.hostfm_address ?? {};
  const site = market?.hostfm_website ? normalizeUrl(market.hostfm_website) : '';

  return (
    <>
      {/* Scaled header (title overlay handled inside) */}
      <HostFMHeaderImage market={market} />

      {/* Back link (matches businesses page style) */}
      <section className="max-w-6xl mx-auto px-4">
        <Link
          href="/hostfarmmarkets"
          className="inline-flex items-center rounded-md bg-white/80 px-3.5 py-2.5 text-lg my-4 font-semibold text-black shadow-sm hover:bg-white"
        >
          <FaArrowLeft className="mr-2" /> Back to Markets
        </Link>
      </section>

      {/* Main content container */}
      <section className="flex justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 gap-6">
            {/* MARKET META: type, description, address + pin, phone, website */}
            <div className="bg-white p-6 rounded-lg shadow-md ring-1 ring-black/10">
              <div className="flex flex-col items-center gap-2 text-center">
                {market?.hostfm_type && (
                  <p className="text-lg text-gray-800">{market.hostfm_type}</p>
                )}
                {market?.hostfm_description && (
                  <p className="text-gray-700">{market.hostfm_description}</p>
                )}

                {/* Address (maps/directions) */}
                <div className="mt-2">
                  <AddressLink address={{
                    add_line1: addr?.add_line1,
                    add_line2: addr?.add_line2,
                    city: addr?.city,
                    state_name: addr?.state_name,
                    state_code: addr?.state_code,
                    zipcode: addr?.zipcode,
                  }} mode="directions" />
                </div>

                {/* Mapping pin (isolated click → modal) */}
                <MappingPin
                  memZip={market?.mem_zip || addr?.zipcode}
                  city={addr?.city}
                  stateName={addr?.state_name || addr?.state || addr?.state_code}
                  className="mt-1 text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
                  mode="modal"
                  size="md"
                />

                {/* Phone */}
                {addr?.hostfm_phone && (
                  <a
                    href={`tel:${cleanPhone(addr.hostfm_phone)}`}
                    className="text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
                  >
                    {formatPhone(addr.hostfm_phone)}
                  </a>
                )}

                {/* Website (conditional) */}
                {site && (
                  <a
                    href={site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
                  >
                    {market.hostfm_website}
                  </a>
                )}
              </div>
            </div>

            {/* Stall availability (conditional) */}
            <HostFMStallInfo market={market} />

            {/* Schedules (never both at once) */}
            {showWeekly && <HostFMarketWeeklySch weekly={weekly} />}
            {showRandom && <HostFMarketRandomDates dates={randomDatesObj?.dates || []} />}

            {!showWeekly && !showRandom && (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-700">
                  No schedule information posted yet for this market.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
