import FarmersMarket from '@/components/FarmersMarket'
import BusinessContact from '@/components/BusinessContact'
import StoreFront from '@/components/StoreFront'
import MappingPin from '@/components/MappingPin'
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

            {/* NEW: location pin */}
            <MappingPin
              memZip={locobiz?.mem_zip}
              city={locobiz?.locobiz_address?.city}
              stateName={locobiz?.locobiz_address?.state_name}
              className="justify-center text-xl font-bold mt-2 text-indigo-700 hover:text-indigo-800 underline decoration-dotted underline-offset-4"
              mode='modal'
              size='md'
            />
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
          {/* Selling & Needing feature section */}
          {/* Selling & Needing — contained and stacked */}
          <div className='w-full'>
            <div className='mb-6 text-center'>
              <h2 className='text-2xl font-semibold'>
                What they’re selling & seeking
              </h2>
            </div>

            <div className='space-y-8'>
              <ItemsGrid
                title='Selling'
                entries={locobiz.selling}
                keys={['selling1', 'selling2', 'selling3']}
              />
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
