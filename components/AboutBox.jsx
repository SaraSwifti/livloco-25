import CurrentStatsBox from '@/components/CurrentStatsBox'
// import NewMemLocal from '@/components/NewMemLocal';
import connectDB from '@/config/database'
import LocoMem from '@/models/LocoMem'

const AboutBox = async () => {
  await connectDB()
  //Get the latest 3 members general info without link
  const recentMems = await LocoMem.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .lean()
  return (
    <div className='mx-auto -mt-12 max-w-7xl p-10 sm:mt-0 lg:px-8 xl:-mt-8'>
      <div className='mx-auto rounded bg-white p-10 max-w-2xl lg:mx-0 lg:max-w-none'>
        <h2 className='text-pretty text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
          More is Less, Less is More, 
        </h2>
        <div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
          <div className='lg:w-full lg:max-w-2xl lg:flex-auto'>
            <h3 className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              More....
            </h3>
            <div className='text-xl/8 text-black'>
               <p className='text-xl/8 text-black'>
              Knowing your neighbor, local business, community, their needs, sustainability,
              interdependence, ....peace.
            </p>
              {/* <ul>
                <li>Distance</li>
                <li>Transport</li>
                <li>Energy</li>
                <li>Cost</li>
                <li>Polution</li>.
                </ul> */}
            </div>
            <br />
            <h3 className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              Less....
            </h3>
            <p className='text-xl/8 text-black'>
              Distance, Transport, Energy, Pollution
           </p>
          </div>

          <div className='lg:flex lg:flex-auto lg:justify-center'>
            <div className='bg-green-100 p-6 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold'>LivLoco's Current Stats</h2>
              {/* Make this counter dynamic */}
              <h1 className='mt-2 mb-4 text-center'>
                <span className='text-green-900 font-xxl'>300 </span>
                {`members have joined so far`}
              </h1>

              <h1 className='text-2xl text-center underline'>
                Our most recent members:
              </h1>
              <br></br>

              {/* <div className="flex flex-col-reverse gap-y-4"> */}
              {recentMems.length === 0 ? (
                <p>No Recent Loco Members Found</p>
              ) : (
                recentMems.map((locomem) => (
                  <CurrentStatsBox
                    key={locomem._id}
                    locomem={locomem}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutBox
