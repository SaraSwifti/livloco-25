const FarmersMarket = ({ locobiz }) => {
  //   const fm = locobiz?.farmers_market_location ?? {};
  // const stateFor = (day) =>
  //   fm[day]?.state_name ?? fm[day]?.state ?? fm[day]?.state_code ?? '';
  const fm = locobiz?.farmers_market_location ?? {}

  const days = [
    ['monday', 'Monday'],
    ['tuesday', 'Tuesday'],
    ['wednesday', 'Wednesday'],
    ['thursday', 'Thursday'],
    ['friday', 'Friday'],
    ['saturday', 'Saturday'],
    ['sunday', 'Sunday'],
  ]
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8'>
      <h1 className='text-xl text-center font-bold text-green-900'>
        Check out the Farmer's Market Schedule for{' '}
      </h1>
      <h1 className='text-2xl text-center font-bold text-green-900'>
        {locobiz.locobiz_name}{' '}
      </h1>
      <div className='mt-8 flow-root'>
        <div className='overflow-x-auto'>
          <div className='inline-block w-full py-2 align-middle'>
            <div className='overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg'>
              <table className='w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                    >
                      Day
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                    >
                      Market Name and location
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {days.map(([key, label]) => {
                    const row = fm?.[key]
                    const name = (row?.farmers_market_name || '').trim()
                    if (!name) return null
                    const city = row?.city || ''
                    const state =
                      row?.state_name ?? row?.state ?? row?.state_code ?? ''
                    return (
                      <tr key={key}>
                        <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                          <p>{label}</p>
                        </td>
                        <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                          <div>{name}</div>
                          <div>
                            {city}
                            {city && state ? ', ' : ''}
                            {state}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmersMarket
