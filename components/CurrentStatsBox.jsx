
import { FaMapMarker } from 'react-icons/fa';


const CurrentStatsBox =  () => {
  
  
  return (
    <div className='container-xl lg:container m-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
        <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
                  <h2 className='text-2xl font-bold'>LivLoco's Current Stats</h2>
                  {/* Make this counter dynamic */}
          <h1 className='mt-2 mb-4'><span className='text-green-900 font-xxl'>
            300 </span>{`members have joined so far`}
          </h1>
                  <div>
                      <h1 className='text-xl underline'>
                          Our most recent members:
                      </h1>
                      <br></br>
            
            
            
               
           
                    <h1> className=''{locomem.locobiz_name}</h1>
                    {/* <FaMapMarker className=' text-orange-700 mt-1'></FaMapMarker> */}
                    <h1 className='text-black'>
                    <FaMapMarker className='inline text-orange-700 mt-1'></FaMapMarker>
                    
                    {locomem.locobiz_address.city}{', '}
                    {locomem.locobiz_address.state}
                    </h1>
                    <br></br>
                  </div>
                )

              )

         </div>
        </div>
      </div>
  
  )
}
 

export default CurrentStatsBox
