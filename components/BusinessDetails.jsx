// import Image from 'next/image';
import FarmersMarket  from "./FarmersMarket";
const BusinessDetails = ({ locomem }) => {
  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        
        <div className="mb-3">
          <h1 className='text-3xl font-bold mb-1'>{locomem.locobiz_name}</h1>
        <h1 className='text-2xl'>{locomem.locobiz_description}</h1>
        {locomem.current_promotional
                  ? <h3 className='text-xl text-orange-800 font-bold'>{`${locomem.current_promotional}`}</h3>
            : null}
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
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-xl text-black'>
                  {`${locomem.selling.selling1.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              
            </div>
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-xl text-black'>
                  {`${locomem.selling.selling2.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              
            </div>
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-xl text-black'>
                  {`${locomem.selling.selling3.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              
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
            <div className='mt-4 flex justify-between'>
             
                <h3 className='text-xl text-black'>
                  {`${locomem.needs.need1.description}`}
                </h3>
             
            </div>
              <div className='mt-4 flex justify-between'>
             
                <h3 className='text-xl text-black'>
                  {`${locomem.needs.need2.description}`}
                </h3>
             
            </div>
              <div className='mt-4 flex justify-between'>
             
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
