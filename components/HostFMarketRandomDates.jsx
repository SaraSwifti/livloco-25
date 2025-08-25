// components/HostFMarketRandomDates.jsx
function formatDate(d) {
  try {
    const date = new Date(d);
    return isNaN(date) ? d : date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: undefined, minute: undefined
    });
  } catch {
    return d;
  }
}

export default function HostFMarketRandomDates({ dates = [] }) {
  const list = Array.isArray(dates) ? dates : [];

  return (
    <section className="w-full">
      <h2 className="text-2xl text-center font-bold text-black">Upcoming Dates</h2>

      <div className="mt-6 -mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl">
            <ul className="divide-y divide-gray-200">
              {list.length === 0 && (
                <li className="px-6 py-4 text-gray-700">No dates posted yet.</li>
              )}
              {list.map((d, idx) => (
                <li key={`${d}-${idx}`} className="px-6 py-4 text-gray-900">
                  {formatDate(d)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
