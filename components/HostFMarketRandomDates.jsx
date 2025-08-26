// components/HostFMarketRandomDates.jsx
function fmtDate(d) {
  try {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return d;
  }
}

function dayOfWeek(d) {
  try {
    const date = new Date(d);
    if (isNaN(date)) return '';
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  } catch {
    return '';
  }
}

export default function HostFMarketRandomDates({ datesObj = {} }) {
 // Build rows from fmrand_date1..N, sorted by ACTUAL date
  const toTS = (d) => {
    const t = Date.parse(d);
    return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
  };
  const entries = Object.entries(datesObj)
    .filter(([k, v]) => k.startsWith('fmrand_date') && v && v.date);
  entries.sort(([, a], [, b]) => toTS(a.date) - toTS(b.date));
  const rows = entries.map(([, v]) => ({
    day: dayOfWeek(v.date),
    date: fmtDate(v.date),
    time: (v.time || '').trim(),
  }));

  if (rows.length === 0) {
    return (
      <section className="w-fullbg-white ">
        <h2 className="text-2xl text-center font-bold text-black">Upcoming Dates</h2>
        <p className="mt-2 text-center text-gray-600">No dates posted yet.</p>
      </section>
    );
  }

  return (
    <section className="w-full">
     

      <div className="mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl transition-shadow duration-300">
               <h2 className="text-2xl pt-6 text-center font-bold text-black">Upcoming Dates</h2>
              <table className="min-w-full">
<caption className="sr-only">Non-weekly, Random-Date-Market schedule</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 px-6 text-left text-sm font-semibold text-black">
                      Day
                    </th>
                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-black">
                      Date
                    </th>
                    <th className="py-3.5 px-3 text-left text-sm font-semibold text-black">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 [&_tr:nth-child(odd)]:bg-gray-50 border-t-2 border-gray-700">
                  {rows.map((r, idx) => (
                    <tr key={idx}>
                      <th scope="row" className="whitespace-nowrap py-4 px-6 text-left text-sm font-medium text-gray-900">
                        {r.day || '—'}
                      </th>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {r.date || '—'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {r.time || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
