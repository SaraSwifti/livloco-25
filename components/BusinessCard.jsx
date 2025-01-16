import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarker } from 'react-icons/fa';


const BusinessCard = ({ locomem }) => {
  return (
    <>
      <div className='rounded-xl shadow-md relative bg-white'>
        <Image
          src={`/images/locobizimages/${locomem.locobiz_profile_image}`}
          // Make a component to insert alt tag for these per customer//

          alt=''
          width='0'
          height='0'
          sizes='100vw'
          className='w-full h-auto rounded-t-xl'
        />
        <div className='p-4'>
          <div className='text-left md:text-center lg:text-left mb-6'>
            
            <h3 className='text-3xl font-bold'>{`${locomem.locobiz_name}`}</h3>
          </div>
          <h3 className='text-xl absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-black font-bold text-right md:text-center lg:text-right'>
            {`${locomem.locobiz_name}`}
          </h3>
          {/* Selling list */}
          
            <div className='text-2xl justify-center gap-4 text-black mb-4'>
            <div className='border border-gray-500 mb-5'>
              <p className=' justify-self-center font-bold'>
                Selling:
              </p>
              <p className='justify-self-center'>{`${locomem.selling.selling1.description}`}</p>
             
              <p className='justify-self-center'>{`${locomem.selling.selling2.description}`}</p>
              <p className='justify-self-center'>{`${locomem.selling.selling3.description}`}</p>
            </div>
            </div>
         
          {/* Needing list */}
          <div className=' text-2xl justify-center gap-4 text-black mb-4'>
          <div className='border border-gray-500 mb-5'>
            <p className='justify-self-center font-bold'>Needing:</p>
            <p className='justify-self-center '>{`${locomem.needs.need1.description}`}</p>
            <p className='justify-self-center '>{`${locomem.needs.need2.description}`}</p>
            <p className='justify-self-center '>{`${locomem.needs.need3.description}`}</p>
            </div>
            </div>

          <div className='border border-gray-300 mb-5'></div>

          <div className='flex flex-col lg:flex-row justify-between mb-4'>
            <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
              <FaMapMarker className=' text-orange-700 mt-1'></FaMapMarker>
              <span className='text-black'>{locomem.locobiz_address.city}{`, `} {locomem.locobiz_address.state}</span>
            </div>
            {/* <Link
              href={`/locomemes/${locomem._id}`}
              className='h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm'
            >
              Details
            </Link> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessCard
