// components/FarmersMarket.jsx
const DAYS = [
  ['monday', 'Monday'],
  ['tuesday', 'Tuesday'],
  ['wednesday', 'Wednesday'],
  ['thursday', 'Thursday'],
  ['friday', 'Friday'],
  ['saturday', 'Saturday'],
  ['sunday', 'Sunday'],
]

export default function FarmersMarket({ locobiz }) {
  // debugging for businesses local farmers markets functionality
  const fm = locobiz?.farmers_market_location ?? {}

  // Build rows once; only keep days that have a market name
  const rows = DAYS.map(([key, label]) => {
    const row = fm?.[key]
    const name = (row?.farmers_market_name ?? '').trim()
    if (!name) return null

    const city = row?.city ?? ''
    const state = row?.state_name ?? row?.state ?? row?.state_code ?? ''
    const addLine1 = row?.add_line1 ?? ''
    const addLine2 = row?.add_line2 ?? ''
    const zipcode = row?.zipcode ?? ''

    // Build full address for Google Maps - only include if we have street address
    const hasStreetAddress = addLine1 && addLine1.trim() !== ''
    const addressParts = hasStreetAddress
      ? [addLine1, addLine2, city, state, zipcode].filter(Boolean)
      : []
    const fullAddress = addressParts.join(', ')

    // Create Google Maps URL - only if we have a street address
    const mapsUrl =
      hasStreetAddress && fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            fullAddress
          )}`
        : ''

    return {
      key,
      label,
      name,
      city,
      state,
      addLine1,
      addLine2,
      zipcode,
      fullAddress,
      mapsUrl,
      hasStreetAddress,
    }
  }).filter(Boolean)

  // Empty state
  if (rows.length === 0) {
    return (
      <section
        aria-labelledby='fm-heading'
        className='w-full px-4 sm:px-6 lg:px-8'
      >
        <h2
          id='fm-heading'
          className='text-2xl text-center font-bold text-black'
        >
          Market or Location Schedule
        </h2>
        <p className='mt-2 text-center text-gray-600'>
          No market or location schedule posted for{' '}
          {locobiz?.locobiz_name ?? 'this business'}.
        </p>
      </section>
    )
  }

  return (
    <div
      className='p-6 rounded-lg border-1 border-gray-700 mt-6'
      style={{
        boxShadow:
          '0 25px 50px -12px rgba(14, 165, 233, 0.5), 0 10px 15px -3px rgba(14, 165, 233, 0.3)',
      }}
    >
      <section aria-labelledby='fm-heading'>
        <h2
          id='fm-heading'
          className='text-2xl pt-3 text-center font-bold text-black'
        >
          Market/Food Truck Location Schedule
        </h2>
        <p className='text-3xl text-center font-bold text-black'>
          for {locobiz?.locobiz_name ?? 'this business'}
        </p>

        <div className='mt-20'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full align-middle sm:px-6 lg:px-8'>
              <div className='overflow-hidden sm:rounded-xl bg-white ring-1 ring-black/25 shadow-2xl transition-shadow duration-300'>
                <table className='min-w-full'>
                  <caption className='sr-only'>
                    Weekly farmers market schedule
                  </caption>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-black'
                      >
                        Day
                      </th>
                      <th
                        scope='col'
                        className='py-3.5 px-3 text-left text-sm font-semibold text-black'
                      >
                        Market/Location
                      </th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-gray-200 [&_tr:nth-child(odd)]:bg-gray-100 border-t-2 border-gray-700'>
                    {rows.map(
                      ({
                        key,
                        label,
                        name,
                        city,
                        state,
                        addLine1,
                        addLine2,
                        zipcode,
                        fullAddress,
                        mapsUrl,
                        hasStreetAddress,
                      }) => (
                        <tr key={key}>
                          <th
                            scope='row'
                            className='whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900'
                          >
                            {label}
                          </th>
                          <td className='px-3 py-4 text-sm text-gray-900'>
                            <div className='space-y-2'>
                              <div className='font-medium text-base'>
                                {name}
                              </div>

                              {/* Show full address details only if we have street address */}
                              {hasStreetAddress ? (
                                <div className='text-gray-700 space-y-1'>
                                  {addLine1 && <div>{addLine1}</div>}
                                  {addLine2 && <div>{addLine2}</div>}
                                  <div>
                                    {city}
                                    {city && state ? ', ' : ''}
                                    {state}
                                    {zipcode && ' '}
                                    {zipcode}
                                  </div>
                                  {mapsUrl && (
                                    <div className='mt-2'>
                                      <a
                                        href={mapsUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200'
                                      >
                                        <svg
                                          className='w-3 h-3 mr-1'
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                          />
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                          />
                                        </svg>
                                        View on Maps
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Show just city and state for older data without street address */
                                (city || state) && (
                                  <div className='text-gray-700'>
                                    {city}
                                    {city && state ? ', ' : ''}
                                    {state}
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
