// import Image from 'next/image';

const BusinessDetails = ({ locomem }) => {
  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        {/* <div className="text-gray-500 mb-4">Apartment</div> */}
        <h1 className='text-3xl font-bold mb-4'>{locomem.locobiz_name}</h1>
        <h1 className='text-2xl'>{locomem.locobiz_description}</h1>
        
        {/* Selling buying feature section */}
        <div className='mx-auto max-w-2xl   '>
          <h2 className='text-xl font-bold tracking-tight text-gray-900'>
            Selling
          </h2>
          <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-sm text-gray-700'>
                  {`${locomem.selling.selling1.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              
            </div>
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-sm text-gray-700'>
                  {`${locomem.selling.selling2.description}`}
                </h3>
              <p className='text-sm font-medium text-gray-900'>{locomem.selling.selling1.price}</p>
              
            </div>
            <div className='mt-4 flex justify-between'>
              
                <h3 className='text-sm text-gray-700'>
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
          <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
            <div className='mt-4 flex justify-between'>
             
                <h3 className='text-sm text-gray-700'>
                  {`${locomem.needs.need1.description}`}
                </h3>
             
            </div>
          </div>
        </div>
        {/* If there is Farmers market details */}

        <p>this is where the farmer's Market Details will go</p>
        <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Day of the Week
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Market Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      City
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      State
                    </th>
                   
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Monday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.monday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Tuesday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.tuesday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Wednesday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.wednesday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Thursday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.thursday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Friday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.friday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Saturday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.saturday.state}`}</td>
                    </tr>
                    <tr >
                      <td className="whitespace-nowrap py-4 px-3 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                       <p>Sunday</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.farmers_market_name}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.city}`}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">{`${locomem.farmers_market_location.sunday.state}`}</td>
                    </tr>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
        

      </div>
    </>
  )
}

export default BusinessDetails;
