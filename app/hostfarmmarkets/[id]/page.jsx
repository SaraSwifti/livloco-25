// app/hostfarmmarkets/[id]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import mongoose from 'mongoose';

import connectDB from '@/config/database';
import HostFMarket from '@/models/HostFMarket';

import HostFMHeaderImage from '@/components/HostFMHeaderImage';
import HostFMarketWeeklySch from '@/components/HostFMarketWeeklySch';
import HostFMarketRandomDates from '@/components/HostFMarketRandomDates';
import HostFMStallInfo from '@/components/HostFMStallInfo';
import AddressLink from '@/components/AddressLink';

// helpers
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

export default async function HostFarmMarketPage(props) {
  // ✅ 1) Await params to satisfy Next’s dynamic API rule
  const { id } = await props.params;

  // ✅ 2) Guard invalid ObjectId (avoids CastError)
  if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

  await connectDB();

  // ✅ 3) Fetch and JSON-safe the doc to avoid passing ObjectId/Date to client comps
  const doc = await HostFMarket.findById(id).lean();
  if (!doc) return notFound();

  // Convert ObjectId/Date → strings/primitives
  const market = JSON.parse(JSON.stringify(doc));

  const weekly = market?.hostfm_weekly_sched ?? {};
  const hasWeekly = toBool(weekly?.weekly_sched);

  const randomDatesObj = market?.hostfm_dates ?? {};
  const hasRandomFlag = toBool(randomDatesObj?.hostfm_randomdates);
  const hasRandomEntries =
    Array.isArray(randomDatesObj?.dates) && randomDatesObj.dates.length > 0;

  const showWeekly = hasWeekly;
  const showRandom = !hasWeekly && (hasRandomFlag || hasRandomEntries);

  const addr = market?.hostfm_address ?? {};
  const site = market?.hostfm_website ? normalizeUrl(market.hostfm_website) : '';
  const hasStall = toBool(market?.stall_avail);

  return (
    <>
      <HostFMHeaderImage market={market} />

      <section className="max-w-6xl mx-auto px-4">
        <Link
          href="/hostfarmmarkets"
          className="inline-flex items-center rounded-md bg-white/80 px-3.5 py-2.5 text-lg my-4 font-semibold text-black shadow-sm hover:bg-white"
        >
          <FaArrowLeft className="mr-2" /> Back to Markets
        </Link>
      </section>

      <section className="flex justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 gap-6">
            {/* Meta */}
            <div className="bg-white p-6 rounded-lg shadow-md ring-1 ring-black/10">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-3xl font-bold mb-1">{market.hostfm_name}</h1>

                {market?.hostfm_type && (
                  <p className="text-2xl text-black">{market.hostfm_type}</p>
                )}

                {market?.hostfm_description && (
                  <p className="text-lg text-black">{market.hostfm_description}</p>
                )}

                {/* Address */}
                <div className="mt-2">
                  <AddressLink
                    className="text-lg text-blue-800 hover:text-blue-900 underline"
                    address={{
                      add_line1: addr?.add_line1,
                      add_line2: addr?.add_line2,
                      city: addr?.city,
                      state_name: addr?.state_name,
                      state_code: addr?.state_code,
                      zipcode: addr?.zipcode,
                    }}
                    mode="directions"
                  />
                </div>

                {/* Phone */}
                {addr?.hostfm_phone && (
                  <a
                    href={`tel:${cleanPhone(addr.hostfm_phone)}`}
                    className="text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
                  >
                    {formatPhone(addr.hostfm_phone)}
                  </a>
                )}

                {/* Actions row */}
                <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Website */}
                  <div className="flex flex-col items-center">
                    {site ? (
                      <Link
                        href={site}
                        target="_blank"
                        rel="noopener noreferrer"
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-2xl font-bold text-blue-800 hover:text-blue-900 underline"
                        title={`Open website for ${market.hostfm_name}`}
                        aria-label={`Open website for ${market.hostfm_name}`}
                      >
                        <FaGlobe className="w-20 h-20" aria-hidden />
                        <span>{`${market.hostfm_name}'s Website`}</span>
                        <FaExternalLinkAlt className="w-4 h-4 opacity-80" aria-hidden />
                      </Link>
                    ) : (
                      <span className="text-gray-500 italic">No website provided</span>
                    )}
                  </div>

                  {/* Messaging placeholder */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-700">Message</p>
                    <button
                      type="button"
                      disabled
                      className="mt-1 inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40"
                      title="Messaging coming soon"
                    >
                      Coming soon
                    </button>
                  </div>

                  {/* Votes placeholder */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold text-gray-700">Votes received</p>
                    <div className="text-2xl font-bold text-gray-900">{market?.votes ?? 0}</div>
                    <button
                      type="button"
                      disabled
                      className="mt-1 inline-flex items-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                      title="Voting coming soon"
                    >
                      Vote
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stall availability */}
            {hasStall ? (
              <HostFMStallInfo market={market} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-lg text-gray-700">
                  No stall availability for vendors at this time.
                </p>
              </div>
            )}

            {/* Schedule (never both) */}
            {showWeekly && <HostFMarketWeeklySch weekly={weekly} />}
            {showRandom && (
              <HostFMarketRandomDates
                datesArr={Array.isArray(randomDatesObj?.dates) ? randomDatesObj.dates : []}
                legacyObj={randomDatesObj}
              />
            )}
            {!showWeekly && !showRandom && (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-700">No schedule information posted yet for this market.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
