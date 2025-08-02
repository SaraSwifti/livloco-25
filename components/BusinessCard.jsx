import Image from 'next/image';
import Link from 'next/link';

import { FaMapMarkerAlt, FaClipboardList, FaDollyFlatbed } from 'react-icons/fa';


const BusinessCard = ({ locobiz }) => {
  return (
    <>
      <Link href={`/businesses/${locobiz._id}`}>
      <div className='rounded-xl pt-1 shadow-md relative bg-white'>
        <div className='mt-5 flex justify-center items-center'>
            {/* {locobiz.locobiz_profile_image?.image ? ( */}
           {locobiz.locobiz_profile_image && locobiz.locobiz_profile_image.trim() !== '' ? (
            <Image
          src={locobiz.locobiz_profile_image}
          // Make a component to insert alt tag for these per customer//

          alt=''
          width='0'
          height='0'
          sizes='100vw'
          className='object-contain h-[200px] w-[300px] rounded-t-xl'
              />
                  ) : (
                          <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}
            {/* ) : (
                 <div className='mt-2 w-full h-40 flex items-center justify-center border border-gray-300 text-gray-500 text-sm italic rounded'>
                            No image available
                          </div>
                        )}; */}
            
          </div>
        <div className='p-4'>
          <div className=' text-center mb-6'>
            
              <h3 className='text-3xl font-bold'>{`${locobiz.locobiz_name}`}</h3>
              <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
              <FaMapMarkerAlt className=' text-orange-700 mt-1'></FaMapMarkerAlt>
                <span className='text-black'>{locobiz.locobiz_address.city}{`, `} {locobiz.locobiz_address.state}</span>
                
              </div>
           
          </div>
            
          {/* Selling list */}
          
            <div className='text-2xl gap-4 text-black mb-4'>
            <div className='border border-gray-500 p-4 mb-5'>
              <p className='mb-2 font-bold'>
                Selling:
                </p>
                {locobiz.selling.selling1.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.selling.selling1.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.selling.selling1.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
                    <p className='mb-2'>{`${locobiz.selling.selling1.description}`}</p>
                  </div>
                )}

                {locobiz.selling.selling2.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.selling.selling2.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.selling.selling2.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
             
                    <p className='mb-1'>{`${locobiz.selling.selling2.description}`}</p>
                  
                  </div>
                )}

                {locobiz.selling.selling3.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.selling.selling3.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.selling.selling3.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
                    <p className='mb-1'>{`${locobiz.selling.selling3.description}`}</p>
                  </div>
                )}
            </div>
            </div>
         
          {/* Needing list */}
          <div className=' text-2xl gap-4 text-black mb-4'>
          <div className='border border-gray-500 p-4 mb-5'>
                <p className='font-bold mb-2'>Needing:</p>
                {locobiz.needs.need1.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.needs.need1.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.needs.need1.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
                    <p className='mb-1 '>{`${locobiz.needs.need1.description}`}</p>
                  </div>
                )}

                {locobiz.needs.need2.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.needs.need2.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.needs.need2.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
                    <p className='mb-1'>{`${locobiz.needs.need2.description}`}</p>
                  </div>
                )}

                {locobiz.needs.need3.description?.trim() && (
                  <div className="flex items-center gap-2 mb-2">
                    {locobiz.needs.need3.type === 'product' ? (
                      <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                    ) : locobiz.needs.need3.type === 'service' ? (
                      <FaClipboardList alt="Service Icon" className=" text-green-800" />
                    ) : null}
                    <p className='mb-1'>{`${locobiz.needs.need3.description}`}</p>
                  </div>
                )}
            </div>
            </div>


        </div> 
          </div>
          
        </Link>
    </>
  )
}
export default BusinessCard
 