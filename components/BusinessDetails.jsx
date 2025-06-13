// import Image from 'next/image';
import FarmersMarket from "./FarmersMarket";
import { FaClipboardList, FaDollyFlatbed } from 'react-icons/fa';
const BusinessDetails = ({ locomem }) => {
  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        
        <div className="mb-3">
          <h1 className='text-3xl font-bold mb-1'>{locomem.locobiz_name}</h1>
        <h1 className='text-2xl'>{locomem.locobiz_description}</h1>
        {locomem.current_promotional
            && (<>
               <h4 className="text-lg text-gray-400 font-semibold">Current Promotion</h4>
            <h3 className='text-xl text-orange-800 font-bold'>{`${locomem.current_promotional}`}</h3>
            
            
            </>)}
        </div>
       
        {/* the key for goods and services */}
        <div className="boarder mb-4">
          <FaDollyFlatbed alt="Product Icon" className="mr-1 mt-1.5 text-blue-800" />
          <FaClipboardList alt="Service Icon" className="mr-1 mt-1.5 text-green-800"/>
        </div>
        {/* Selling buying feature section */}
        <div className='mx-auto max-w-2xl   '>
          <h2 className='text-xl font-bold tracking-tight text-gray-900'>
            Selling
          </h2>
          <div className='mb-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'>
            {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
            <div className='mt-4 flex items-start gap-2'>
              {locomem.selling.selling1.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-1 mt-1.5 text-blue-800" />
      ) : locomem.selling.selling1.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-1 mt-1.5 text-green-800"/>
      ) : null}
                <div className="flex flex-col">
              <h3 className='text-xl text-left text-black'>
                 
                  {`${locomem.selling.selling1.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              </div>
            </div>
            
            <div className='mt-4 flex items-start gap-2'>
                {locomem.selling.selling2.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-1 mt-1.5 text-blue-800" />
      ) : locomem.selling.selling2.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-1 mt-1.5 text-green-800"/>
              ) : null}
              <div className="flex flex-col">
                <h3 className='text-xl text-black'>
                  {`${locomem.selling.selling2.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling2.price}</p>
              </div>
            </div>
            <div className='mt-4 flex items-start gap-2'>
               {locomem.selling.selling3.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-1 mt-1.5 text-blue-800" />
      ) : locomem.selling.selling3.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-1 mt-1.5 text-green-800"/>
              ) : null}
              <div className="flex flex-col">
                <h3 className='text-xl text-black'>
                  {`${locomem.selling.selling3.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Buying list feature section */}
        <div className='mx-auto max-w-2xl   '>
          <h2 className='text-xl font-bold tracking-tight text-gray-900'>
            Buying
          </h2>
          <div className='mb-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'>
            {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
            <div className='mt-4 flex '>
               {locomem.needs.need1.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-1 mt-1.5 text-blue-800" />
      ) : locomem.needs.need1.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-1 mt-1.5 text-green-800"/>
      ) : null}
              <h3 className='text-xl text-black'>
                  {`${locomem.needs.need1.description}`}
                </h3>
             
            </div>
            <div className='mt-4 flex'>
                    {locomem.needs.need2.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-2 mt-1.5 text-blue-800" />
      ) : locomem.needs.need2.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-2 mt-1.5 text-green-800"/>
      ) : null}
             
                <h3 className='text-xl text-black'>
                  {`${locomem.needs.need2.description}`}
                </h3>
             
            </div>
            <div className='mt-4 flex '>
                    {locomem.needs.need3.type === 'Product' ? (
        <FaDollyFlatbed alt="Product Icon" className="mr-2 mt-1.5 text-blue-800" />
      ) : locomem.needs.need3.type === 'Service' ? (
        <FaClipboardList alt="Service Icon" className="mr-2 mt-1.5 text-green-800"/>
      ) : null}
             
                <h3 className='text-xl text-black'>
                  {`${locomem.needs.need3.description}`}
                </h3>
             
            </div>
          </div>
        </div>

        {/* If there is Farmers market details */}
        {locomem?.farmers_market_location?.fm_location_post === true && (<FarmersMarket locomem={locomem} />
        )}
                  

        

      </div>
    </>
  )
}

export default BusinessDetails;
