// components/FarmersMarket.jsx
const DAYS = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
];

export default function FarmersMarket({ locobiz }) {
  const fm = locobiz?.farmers_market_location ?? {};

  // Build rows once; only keep days that have a market name
  const rows = DAYS.map(([key, label]) => {
    const row = fm?.[key];
    const name = (row?.farmers_market_name ?? '').trim();
    if (!name) return null;
    const city = row?.city ?? '';
    const state = row?.state_name ?? row?.state ?? row?.state_code ?? '';
    return { key, label, name, city, state };
  }).filter(Boolean);

  // Empty state
  if (rows.length === 0) {
    return (
      <section aria-labelledby="fm-heading" className="w-full px-4 sm:px-6 lg:px-8">
        <h2 id="fm-heading" className="text-2xl text-center font-bold text-black">
          Farmers Market Schedule
        </h2>
        <p className="mt-2 text-center text-gray-600">
          No farmers market schedule posted for {locobiz?.locobiz_name ?? 'this business'}.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="fm-heading" className="w-full px-4 sm:px-6 lg:px-8">
      <h2 id="fm-heading" className="text-2xl text-center font-bold text-black">
        Farmers Market Schedule for {locobiz?.locobiz_name ?? 'this business'}
      </h2>

      <div className="mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
             <div className="overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl transition-shadow duration-300">
              <table className="min-w-full">
                <caption className="sr-only">Weekly farmers market schedule</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-black"
                    >
                      Day
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-black"
                    >
                      Market
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-black"
                    >
                      Location
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 [&_tr:nth-child(odd)]:bg-gray-50 border-t-2 border-gray-700">
                  {rows.map(({ key, label, name, city, state }) => (
                    <tr key={key}>
                      <th
                        scope="row"
                        className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900"
                      >
                        {label}
                      </th>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {city}
                        {city && state ? ', ' : ''}
                        {state}
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

