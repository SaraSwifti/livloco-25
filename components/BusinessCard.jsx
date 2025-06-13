import Image from 'next/image';
import Link from 'next/link';

import { FaMapMarkerAlt, FaClipboardList, FaDollyFlatbed } from 'react-icons/fa';


const BusinessCard = ({ locomem }) => {
  return (
    <>
      <Link href={`/businesses/${locomem._id}`}>
      <div className='rounded-xl pt-1 shadow-md relative bg-white'>
        <div className='mt-5 flex justify-center items-center'>
        <Image
          src={`/images/locobizimages/${locomem.locobiz_profile_image}`}
          // Make a component to insert alt tag for these per customer//

          alt=''
          width='0'
          height='0'
          sizes='100vw'
          className='object-contain h-[200px] w-[300px] rounded-t-xl'
          />
          </div>
        <div className='p-4'>
          <div className=' text-center mb-6'>
            
              <h3 className='text-3xl font-bold'>{`${locomem.locobiz_name}`}</h3>
              <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
              <FaMapMarkerAlt className=' text-orange-700 mt-1'></FaMapMarkerAlt>
                <span className='text-black'>{locomem.locobiz_address.city}{`, `} {locomem.locobiz_address.state}</span>
                
              </div>
           
          </div>
            
          {/* Selling list */}
          
            <div className='text-2xl gap-4 text-black mb-4'>
            <div className='border border-gray-500 p-4 mb-5'>
              <p className='mb-2 font-bold'>
                Selling:
                </p>
               <div className="flex items-center gap-2 mb-2">
                 {locomem.selling.selling1.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.selling.selling1.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
                  <p className='mb-2'>{`${locomem.selling.selling1.description}`}</p>
                  </div>
                <div className="flex items-center gap-2 mb-2">
                 {locomem.selling.selling2.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.selling.selling2.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
             
                  <p className='mb-1'>{`${locomem.selling.selling2.description}`}</p>
                  
                </div>
                <div className="flex items-center gap-2 mb-2">
                 {locomem.selling.selling3.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.selling.selling3.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
                  <p className='mb-1'>{`${locomem.selling.selling3.description}`}</p>
                  </div>
            </div>
            </div>
         
          {/* Needing list */}
          <div className=' text-2xl gap-4 text-black mb-4'>
          <div className='border border-gray-500 p-4 mb-5'>
                <p className='font-bold mb-2'>Needing:</p>
                
                 <div className="flex items-center gap-2 mb-2">
                 {locomem.needs.need1.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.needs.need1.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
                  <p className='mb-1 '>{`${locomem.needs.need1.description}`}</p>
                </div>
                 <div className="flex items-center gap-2 mb-2">
                 {locomem.needs.need2.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.needs.need2.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
                  <p className='mb-1'>{`${locomem.needs.need2.description}`}</p>
                </div>
                 <div className="flex items-center gap-2 mb-2">
                 {locomem.needs.need3.type === 'Product' ? (
                        <FaDollyFlatbed alt="Product Icon" className=" text-blue-800" />
                      ) : locomem.needs.need3.type === 'Service' ? (
                        <FaClipboardList alt="Service Icon" className=" text-green-800"/>
                      ) : null}
                  <p className='mb-1'>{`${locomem.needs.need3.description}`}</p>
                  </div>
            </div>
            </div>


        </div> 
          </div>
          
        </Link>
    </>
  )
}
export default BusinessCard
 