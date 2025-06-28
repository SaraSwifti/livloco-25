import { FaMapMarker } from 'react-icons/fa'

const CurrentStatsBox = ({ locobiz }) => {
  return (
    <div className='text-center'>
      <h1 className='text-2xl text-bold'>{locobiz.locobiz_name}</h1>

      <h1 className='text-black'>
        <FaMapMarker className='inline text-orange-700 mt-1'></FaMapMarker>

        {locobiz.locobiz_address.city}
        {', '}
        {locobiz.locobiz_address.state}
      </h1>
      <br></br>
    </div>
  )
}

export default CurrentStatsBox
