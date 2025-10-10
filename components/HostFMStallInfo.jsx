// components/HostFMStallInfo.jsx
'use client';

const toBool = (v) =>
  v === true || (typeof v === 'string' && v.trim().toLowerCase() === 'true') || v === 1;

export default function HostFMStallInfo({ market }) {
  if (!toBool(market?.stall_avail)) return null;

  const { stall_pricing, stall_size, stall_included } = market || {};

  return (
    <section className="w-full">
      <div className="bg-white  p-6 rounded-lg ring-1 ring-black/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Stall Availability</h2>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <dt className="text-xl font-bold text-black">Pricing</dt>
            <dd className="text-black text-lg">{stall_pricing || '—'}</dd>
          </div>
          <div>
            <dt className="text-xl font-bold text-black">Stall Size</dt>
            <dd className="text-black text-lg">{stall_size || '—'}</dd>
          </div>
          <div>
            <dt className="text-xl font-bold text-black">Included</dt>
            <dd className="text-black text-lg">{stall_included || '—'}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
