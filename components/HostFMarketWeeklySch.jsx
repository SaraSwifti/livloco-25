// components/HostFMarketWeeklySch.jsx
const DAYS = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
];

export default function HostFMarketWeeklySch({ weekly = {} }) {
  // Handle the known data typo "fr_iday_hours" gracefully
  const getHours = (key) => {
    if (key === 'friday') return weekly?.friday_hours ?? weekly?.fr_iday_hours ?? '';
    return weekly?.[`${key}_hours`] ?? '';
  };

  return (
    <section className="w-full">
      <h2 className="text-2xl text-center font-bold text-black">Weekly Schedule</h2>

      <div className="mt-6 -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-black">
                    Day
                  </th>
                  <th className="py-3.5 px-3 text-left text-sm font-semibold text-black">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 [&_tr:nth-child(odd)]:bg-gray-50 border-t-2 border-gray-700">
                {DAYS.map(([k, label]) => {
                  const val = String(getHours(k) || '').trim();
                  return (
                    <tr key={k}>
                      <th scope="row" className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                        {label}
                      </th>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {val || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
