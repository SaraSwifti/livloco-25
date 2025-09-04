import { FaMapMarker } from 'react-icons/fa';
import zipcodes from 'zipcodes';

const CurrentStatsBox = ({ locobiz }) => {
  const location = zipcodes.lookup(locobiz.mem_zip);
  const cityState = location ? `${location.city}, ${location.state}` : locobiz.mem_zip;
  return (
    <div className='text-center'>
      <h1 className='text-2xl text-bold'>{locobiz.locobiz_name}</h1>

      <h1 className='text-black'>
        <FaMapMarker className='inline text-orange-700 mt-1'></FaMapMarker>

   {cityState}
      </h1>
      <br></br>
    </div>
  )
}

export default CurrentStatsBox
