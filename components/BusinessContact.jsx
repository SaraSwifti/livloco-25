import Link from 'next/link'
import { FaGlobe, FaGlobeAsia } from 'react-icons/fa'

const BusinessContact = ({ locomem }) => {
  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <h1 className='text-xl text-center pb-4 font-bold'>
          LocoMember's Contact Information
        </h1>
        {/* This is where I am going to add the chance to message the member through the platform */}
        {(locomem?.website || '').trim() !== '' ? (
          <div className='flex justify-center items-center'>
            <Link
              href={locomem.website}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center space-x-2 text-blue-800 hover:text-blue-900'
            >
              <span>LocoMember's Website</span>
              <FaGlobeAsia className='w-6 h-6 text-blue-800 hover:text-blue-900 cursor-pointer' />
            </Link>
          </div>
        ) : null}

        {/* store front address and hours */}
        {locomem?.locobiz_address?.post_permission === true && (
          <div>
        <h1 className='text-xl pt-3 text-center font-bold text-green-900'>
          Storefront Address and Hours
        </h1>
        <div className='flex justify-center items-center'>
          <h1 className='text-xl text-green-900'>
            {locomem.locobiz_address.biz_phone}
          </h1>
        </div>
        <div className='flex justify-center items-center'>
          <h1 className='text-xl text-green-900'>
            {locomem.locobiz_address.add_line1}
          </h1>
        </div>
        <div className='flex justify-center items-center'>
          <h1 className='text-xl text-green-900'>
            {locomem.locobiz_address.add_line2}
          </h1>
        </div>
        <div className='flex justify-center items-center'>
          <h1 className='text-xl text-green-900'>
            {locomem.locobiz_address.city}
            {`, `} {locomem.locobiz_address.state}
            {` `}
            {locomem.locobiz_address.zipcode}
          </h1>
        </div>

        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
              <div className='overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Monday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.monday_hours}`}</td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Tuesday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.tuesday_hours}`}</td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Wednesday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.wednesday_hours}`}</td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Thursday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.thursday_hours}`}</td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Friday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.friday_hours}`}</td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Saturday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>
                        ${locomem.business_hours.saturday_hours}
                      </td>
                    </tr>
                    <tr>
                      <td className='whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
                        <p>Sunday</p>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-black'>{`${locomem.business_hours.sunday_hours}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
            </div>
            </div>
          )}
      </div>
    </>
  )
}

export default BusinessContact
