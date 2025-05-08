// import Image from 'next/image';



const BusinessSellingBuying = ({ locomem }) => {
    return ( 
        <>
         
        <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                      {/* <div className="text-gray-500 mb-4">Apartment</div> */}
                    <h1 className="text-3xl font-bold mb-4">{locomem.locobiz_name}</h1>
                      <div
                        className="text-black mb-4 flex align-middle justify-center md:justify-start"
                      >
                        <p className="text-black">
                        {locomem.locobiz_description}
                        </p>
                      </div>
                    {/* Selling buying feature section */}
                    <div className="mx-auto max-w-2xl   ">
                      <h2 className="text-xl font-bold tracking-tight text-gray-900">Selling</h2>
                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                       {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                          {`${locomem.selling.selling1.description}`}
                            
                          </h3>
                          <p className="text-sm font-medium text-gray-900">price</p>
                        </div>
                        
                      </div>
                    </div>
                
                    
            </div>
            {/* Buying list feature section */}
          <div className="mx-auto max-w-2xl   ">
                      <h2 className="text-xl font-bold tracking-tight text-gray-900">Buying</h2>
                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                       {/* <Image
                                  src={ `/images/locobizimages/${locomem.selling.selling1.image}`}
                                  alt=''
                                  className="object-cover h-[400px] w-full"
                                              width={20}
                                              height={20}
                                              sizes='25vw'
                                /> */}
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                          {`${locomem.needs.need1.description}`}
                            
                          </h3>
                          
                        </div>
                        
                      </div>
                    </div>
                
                    </div>
                   </div>
         
          
       
       

            
            
        </>
     );
}
 
export default BusinessSellingBuying;