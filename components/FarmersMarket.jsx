
const FarmersMarket = ({ locobiz }) => {
//   const fm = locobiz?.farmers_market_location ?? {};
// const stateFor = (day) =>
//   fm[day]?.state_name ?? fm[day]?.state ?? fm[day]?.state_code ?? '';

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
                  {/* conditional rendering of monday's farm market if not data is there */}
                  {(
                    locobiz?.farmers_market_location?.monday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Monday</p>
                      </td>
                      <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.monday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.monday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.monday.state_name}`}
                        </div>
                      </td>
                    </tr>
                  ) : null}

                  {(
                    locobiz?.farmers_market_location?.tuesday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Tuesday</p>
                      </td>
                      <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.tuesday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.tuesday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.tuesday.state_name}`}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {(
                    locobiz?.farmers_market_location?.wednesday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap  py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Wednesday</p>
                      </td>
                       <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.wednesday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.wednesday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.wednesday.state_name}`}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {(
                    locobiz?.farmers_market_location?.thursday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Thursday</p>
                        </td>
                        <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.thursday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.thursday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.thursday.state_name}`}
                        </div>
                      </td>
  
                    </tr>
                  ) : null}
                  {(
                    locobiz?.farmers_market_location?.friday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Friday</p>
                      </td>
                <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.friday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.friday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.friday.state_name}`}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {(
                    locobiz?.farmers_market_location?.saturday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Saturday</p>
                        </td>
                        <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.saturday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.saturday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.saturday.state_name}`}
                        </div>
                      </td>
                      </tr>
                  ) : null}
                  {(
                    locobiz?.farmers_market_location?.sunday
                      ?.farmers_market_name || ''
                  ).trim() !== '' ? (
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Sunday</p>
                      </td>
                      
                      <td className='whitespace-nowrap text-center px-3 py-4 text-sm text-black'>
                        <div>{`${locobiz.farmers_market_location.sunday.farmers_market_name}`}</div>
                        <div>
                          {`${locobiz.farmers_market_location.sunday.city}`}
                          {', '}
                          {`${locobiz.farmers_market_location.sunday.state_name}`}
                        </div>
                        </td>
                      </tr>
                  ) : null}
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
