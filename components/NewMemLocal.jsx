import businesses from '@/app/locomems.json'

const NewMemLocal = () => {
    return ( 
        
            <div 
                        className='flex align-middle gap-2 mb-4 lg:mb-0'>
                  <FaMapMarker className=' text-orange-700 mt-1'></FaMapMarker>
                  <span className='text-orange-700'>
                    {business.locobiz.locobiz_address.city}{' '}
                    {business.locobiz.locobiz_address.state}
                  </span>
                </div>
              
        
     );
}
 
export default NewMemLocal;