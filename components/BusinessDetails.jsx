// import Image from 'next/image';
import FarmersMarket from './FarmersMarket'
import BusinessContact from './BusinessContact'
import Image from 'next/image'
import { FaClipboardList, FaDollyFlatbed } from 'react-icons/fa'
const BusinessDetails = ({ locomem }) => {
  return (
    <>
      <section className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <div className='p-4'>
          <div className='flex flex-col items-center justify-center mb-3'>
            <h1 className='text-3xl font-bold mb-1'>{locomem.locobiz_name}</h1>
            <h1 className='text-2xl'>{locomem.locobiz_description}</h1>
          </div>
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 p-3 text-center'>
              {(locomem.current_promotional || '').trim() !== '' && (
                <>
                  <h4 className='text-lg text-gray-400 font-semibold'>
                    Current Promotion
                  </h4>
                  <h3 className='text-xl text-orange-800 font-bold'>{`${locomem.current_promotional}`}</h3>
                </>
              )}

              {/* the key for goods and services */}
              <div className='mb-4'>
                <FaDollyFlatbed
                  alt='Product Icon'
                  className='mr-1 mt-1.5 text-blue-800'
                />
                <FaClipboardList
                  alt='Service Icon'
                  className='mr-1 mt-1.5 text-green-800'
                />
              </div>
            </div>
            <div className='lg:w-1/2 p-3 text-center'>
              <p>LocoMember Messaging button</p>
              <p>votes</p>
              <p>Member since</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full mx-auto'>
            {/* Selling buying feature section */}
            <div className='col-span-1 md:col-span-2 lg:col-span-2'>
              <div className='p-4 border rounded shadow'>
                <h2 className='text-xl font-bold tracking-tight text-gray-900 mb-4'>
                  Selling
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {/* Selling item 1 */}
                  {locomem.selling.selling1?.description?.trim() && (
                  <div className='flex items-start gap-2'>
                    {locomem.selling.selling1.type === 'Product' ? (
                      <div className='flex items-start gap-2'>
                        <FaDollyFlatbed
                          alt='Product Icon'
                          className='mr-1 mt-1.5 text-blue-800'
                        />
                      </div>
                    ) : locomem.selling.selling1.type === 'Service' ? (
                      <div className='flex items-start gap-2'>
                        <FaClipboardList
                          alt='Service Icon'
                          className='mr-1 mt-1.5 text-green-800'
                        />{' '}
                      </div>
                    ) : null}
                    <div className='flex flex-col'>
                      <h3 className='text-xl text-left text-black'>
                        {`${locomem.selling.selling1.description}`}
                      </h3>
                      <p className='text-sm font-medium text-gray-900'>
                        {locomem.selling.selling1.price}
                      </p>
                      {locomem.selling.selling1?.image ? (
                        <Image
                          src={`/images/locobizimages/${locomem.selling.selling1.image}`}
                          alt={locomem.selling.selling1.description || 'Need item image'}
                          className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                          width={600}
                          height={400}
                          sizes='(max-width: 768px) 100vw, 33vw'
                        />
                      ) : (
                        <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                          No image available
                        </div>
                      )}
                    </div>
                    </div>
                  )}
                  
                  {/* Selling item 2 */}
                  {locomem.selling.selling2?.description?.trim() && (
                    <div className='flex items-start gap-2'>
                      {locomem.selling.selling2.type === 'Product' ? (
                        <div className='flex items-start gap-2'>
                          <FaDollyFlatbed
                            alt='Product Icon'
                            className='mr-1 mt-1.5 text-blue-800'
                          />
                        </div>
                      ) : locomem.selling.selling2.type === 'Service' ? (
                        <div className='flex items-start gap-2'>
                          <FaClipboardList
                            alt='Service Icon'
                            className='mr-1 mt-1.5 text-green-800'
                          />
                        </div>
                      ) : null}
                      <div className='flex flex-col'>
                        <h3 className='text-xl text-black'>
                          {`${locomem.selling.selling2.description}`}
                        </h3>
                        <p className='text-sm font-medium text-gray-900'>
                          {locomem.selling.selling2.price}
                        </p>
                        {locomem.selling.selling2?.image ? (
                          <Image
                            src={`/images/locobizimages/${locomem.selling.selling2.image}`}
                            alt={locomem.selling.selling2.description || 'Need item image'}
                            className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                            width={600}
                            height={400}
                            sizes='(max-width: 768px) 100vw, 33vw'
                          />
                        ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* selling item 3 */}
                  {locomem.selling.selling3?.description?.trim() && (
                    <div className='flex items-start gap-2'>
                      {locomem.selling.selling3.type === 'Product' ? (
                        <div className='flex items-start gap-2'>
                          <FaDollyFlatbed
                            alt='Product Icon'
                            className='mr-1 mt-1.5 text-blue-800'
                          />
                        </div>
                      ) : locomem.selling.selling3.type === 'Service' ? (
                        <div className='flex items-start gap-2'>
                          <FaClipboardList
                            alt='Service Icon'
                            className='mr-1 mt-1.5 text-green-800'
                          />
                        </div>
                      ) : null}
                      <div className='flex flex-col'>
                        <h3 className='text-xl text-black'>
                          {`${locomem.selling.selling3.description}`}
                        </h3>
                        <p className='text-sm font-medium text-gray-900'>
                          {locomem.selling.selling3.price}
                        </p>
                        {locomem.selling.selling3?.image ? (
                          <Image
                            src={`/images/locobizimages/${locomem.selling.selling3.image}`}
                            alt={locomem.selling.selling3.description || 'Need item image'}
                            className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                            width={600}
                            height={400}
                            sizes='(max-width: 768px) 100vw, 33vw'
                          />
                        ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Buying list feature section */}
            <div className='col-span-1 md:col-span-2 lg:col-span-2'>
              {/* Needing item 1 */}
              <div className='p-4 border rounded shadow'>
                <h2 className='text-xl font-bold tracking-tight text-gray-900 mb-4'>
                  Needing
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {/* Needing item 1 */}
                  {locomem.needs.need1?.description?.trim() && (
                    <div className='flex items-start gap-2'>
                      {locomem.needs.need1.type === 'Product' ? (
                        <div className='flex items-start gap-2'>
                          <FaDollyFlatbed
                            alt='Product Icon'
                            className='mr-1 mt-1.5 text-blue-800'
                          />
                        </div>
                      ) : locomem.needs.need1.type === 'Service' ? (
                        <div className='flex items-start gap-2'>
                          <FaClipboardList
                            alt='Service Icon'
                            className='mr-1 mt-1.5 text-green-800'
                          />
                        </div>
                      ) : null}
                      <div className='flex flex-col'>
                        <h3 className='text-xl text-left text-black'>
                          {`${locomem.needs.need1.description}`}
                        </h3>
                        {locomem.needs.need1?.image ? (
                          <Image
                            src={`/images/locobizimages/${locomem.needs.need1.image}`}
                            alt={locomem.needs.need1.description || 'Need item image'}
                            className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                            width={600}
                            height={400}
                            sizes='(max-width: 768px) 100vw, 33vw'
                          />
                        ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Needing item 2 */}
                  {locomem.needs.need2?.description?.trim() && (
                    <div className='flex items-start gap-2'>
                      {locomem.needs.need2.type === 'Product' ? (
                        <div className='flex items-start gap-2'>
                          <FaDollyFlatbed
                            alt='Product Icon'
                            className='mr-2 mt-1.5 text-blue-800'
                          />
                        </div>
                      ) : locomem.needs.need2.type === 'Service' ? (
                        <div className='flex items-start gap-2'>
                          <FaClipboardList
                            alt='Service Icon'
                            className='mr-2 mt-1.5 text-green-800'
                          />
                        </div>
                      ) : null}
                      <div className='flex flex-col'>
                        <h3 className='text-xl text-black'>
                          {`${locomem.needs.need2.description}`}
                        </h3>
                        {locomem.needs.need2?.image ? (
                          <Image
                            src={`/images/locobizimages/${locomem.needs.need2.image}`}
                            alt='Selling item'
                            className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                            width={600}
                            height={400}
                            sizes='(max-width: 768px) 100vw, 33vw'
                          />
                        ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* needing item 3 */}
                  {locomem.needs.need3?.description?.trim() && (
                    <div className='flex items-start gap-2'>
                      {locomem.needs.need3.type === 'Product' ? (
                        <div className='flex items-start gap-2'>
                          <FaDollyFlatbed
                            alt='Product Icon'
                            className='mr-2 mt-1.5 text-blue-800'
                          />
                        </div>
                      ) : locomem.needs.need3.type === 'Service' ? (
                        <div className='flex items-start gap-2'>
                          <FaClipboardList
                            alt='Service Icon'
                            className='mr-2 mt-1.5 text-green-800'
                          />
                        </div>
                      ) : null}
                      <div className='flex flex-col'>
                        <h3 className='text-xl text-black'>
                          {`${locomem.needs.need3.description}`}
                        </h3>
                        {locomem.needs.need3?.image ? (
                          <Image
                            src={`/images/locobizimages/${locomem.needs.need1.image}`}
                           alt={locomem.needs.need3.description || 'Need item image'}
                            className='mt-2 object-cover w-full h-auto max-h-64 sm:max-h-80 rounded'
                            width={600}
                            height={400}
                            sizes='(max-width: 768px) 100vw, 33vw'
                          />
                        ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-6 mt-8'>
          <div
            className={
              locomem?.farmers_market_location?.fm_location_post === true
                ? 'md:w-1/2'
                : 'md:w-full'
            }
          >
            <BusinessContact
              locomem={locomem}
              className='h-full flex flex-col'
            />
          </div>
          {/* If there is Farmers market details */}
          {locomem?.farmers_market_location?.fm_location_post === true && (
            <div className='md:w-1/2'>
              <FarmersMarket locomem={locomem} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BusinessDetails
