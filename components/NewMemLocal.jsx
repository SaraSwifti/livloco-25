import connectDB from "@/config/database";
import LocoMem from "@/models/LocoMem";
import { FaMapMarker } from 'react-icons/fa';



const NewMemLocal = async () => {
  await connectDB();

  const recentMems = await LocoMem.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  
  
  return (
        
    <div className='rounded-xl shadow-md relative bg-white'>
      <div className='mt-5 flex justify-center items-center'>
      
      </div>
      {recentMems.length === 0 ? (
        <p>No Recent Members</p>)
        :
        (
          <div className='p-4'>
            <div className='text-left md:text-center lg:text-left mb-6'>
          
              <h3 className='text-3xl font-bold'>{`${recentMems.locobiz_name}`}</h3>
            </div>
            <h3 className='text-xl absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-black font-bold text-right md:text-center lg:text-right'>
              {`${recentMems.locobiz_name}`}
            </h3>
            <div className='text-2xl justify-center gap-4 text-black mb-4'>
            </div>
            <div className='border border-gray-300 mb-5'></div>

            <div className='flex flex-col lg:flex-row justify-between mb-4'>
              <div className='flex align-middle gap-2 mb-4 lg:mb-0'>
                <FaMapMarker className=' text-orange-700 mt-1'></FaMapMarker>
                <span className='text-black'>{recentMems.locobiz_address.city}{`, `} {recentMems.locobiz_address.state}</span>
              </div>
             
            </div>
          </div>
        )
      }
      
      </div>
     
    
              
        
     );
}
 
export default NewMemLocal;