import FarmersMarket from '@/components/FarmersMarket'
import BusinessContact from '@/components/BusinessContact'
import StoreFront from '@/components/StoreFront'
import Image from 'next/image'
import { FaClipboardList, FaDollyFlatbed } from 'react-icons/fa'
import ItemsGrid from './ItemsGrid'

const BusinessDetails = ({ locobiz }) => {
  return (
    <>
      <section className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <div className='p-4'>
          <div className='flex flex-col items-center justify-center mb-3'>
            <h1 className='text-3xl font-bold mb-1'>{locobiz.locobiz_name}</h1>
            <h1 className='text-2xl'>{locobiz.locobiz_description}</h1>
          </div>
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 p-3 text-center'>
              {(locobiz.current_promotional || '').trim() !== '' && (
                <>
                  <h4 className='text-lg text-gray-400 font-semibold'>
                    Current Promotional
                  </h4>
                  <h3 className='text-xl text-orange-800 font-bold'>{`${locobiz.current_promotional}`}</h3>
                </>
              )}

              {/* the key for goods and services */}
              <div className='mb-4 space-y-2'>
                <div className='flex items-center text-blue-800'>
                  <FaDollyFlatbed
                    alt='Product Icon'
                    className='mr-1 mt-1.5 text-blue-800'
                  />
                  <span className='text-sm font-medium'> = Products</span>
                </div>
                <div className='flex items-center text-blue-800'>
                  <FaClipboardList
                    alt='Service Icon'
                    className='mr-1 mt-1.5 text-green-800'
                  />
                  <span className='text-sm font-medium'> = Services</span>
                </div>
              </div>
            </div>
            <div className='lg:w-1/2 p-3 text-center'>
              <p>LocoMember Messaging button</p>
              <p>votes</p>
              <p>Member since</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full mx-auto'>
            Selling buying feature section
            <div className='col-span-1 md:col-span-2 lg:col-span-2'>
              {/* <div className='p-4 border rounded shadow'>
                <h2 className='text-xl font-bold tracking-tight text-gray-900 mb-4'>
                  Selling
                </h2> */}
                <ItemsGrid
                  title='Selling'
                  entries={locobiz.selling}
                  keys={['selling1', 'selling2', 'selling3']}
                />
              {/* </div> */}
            </div>
            {/* Buying list feature section */}
            <div className='col-span-1 md:col-span-2 lg:col-span-2'>
              <ItemsGrid
                title='Needing'
                entries={locobiz.needs}
                keys={['need1', 'need2', 'need3']}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-6 mt-8'>
          {/* Left Column: BusinessContact + StoreFront */}
          <div
            className={
              locobiz?.farmers_market_location?.fm_location_post === true
                ? 'md:w-1/2'
                : 'md:w-full'
            }
          >
            <BusinessContact
              locobiz={locobiz}
              className='mb-6'
            />
            {locobiz?.locobiz_address?.post_permission === true && (
              <StoreFront locobiz={locobiz} />
            )}
          </div>

          {/* If there is Farmers market details */}
          {locobiz?.farmers_market_location?.fm_location_post === true && (
            <div className='md:w-1/2'>
              <FarmersMarket locobiz={locobiz} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BusinessDetails
