import { FaMapMarker } from 'react-icons/fa'

const CurrentStatsBox = ({ locomem }) => {
  return (
    <div className='text-center'>
      <h1 className='text-2xl text-bold'>{locomem.locobiz_name}</h1>

      <h1 className='text-black'>
        <FaMapMarker className='inline text-orange-700 mt-1'></FaMapMarker>

        {locomem.locobiz_address.city}
        {', '}
        {locomem.locobiz_address.state}
      </h1>
      <br></br>
    </div>
  )
}

export default CurrentStatsBox
