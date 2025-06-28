import CurrentStatsBox from '@/components/CurrentStatsBox';
// import NewMemLocal from '@/components/NewMemLocal';
import connectDB from '@/config/database';
import LocoBiz from '@/models/LocoBiz';

const AboutBox = async () => {
  await connectDB()
  //Get the latest 3 members general info without link
  const recentBizs = await LocoBiz.find({})
    .sort({ createdAt: -1 })
    .limit(5)
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
                Knowing your neighbor, local business, community, their needs.
                Growing in our sustainability interdependence, ....peace.
              </p>
            </div>
            <br />
            <h3 className='text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              Less....
            </h3>
            <p className='text-xl/8 text-black'>
              Distance, Transport, Energy, Pollution
            </p>
            <br />
            <h3 className='text-pretty pb-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              At the LivLoco Co-op:
            </h3>
            <ul className='list-disc ml-6 space-y-2'>
              <li className='text-xl/8 text-black'>
                Everyone has a seat at the table, regardless of how large or
                small your business is.
              </li>
              <li className='text-xl/8 text-black'>
                You can be a member without posting a business and just look
                around.
              </li>
              <li className='text-xl/8 text-black'>
                Yearly memberships are $35/year with the ability to post up to
                three items you would like to sell and up to three items that
                you are needing to make your business more locally sustainable.
              </li>
            </ul>
            <br />
            <h3 className='text-pretty pb-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
              I hope that...
            </h3>
            <p className='text-xl/8 text-black'>
              You find this helpful. We can make an app for this site someday.
              We can offer scholarships to those wanting to learn a new trade,
              regardless of age. Together, the possibilities are endless!
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
              {recentBizs.length === 0 ? (
                <p>No Recent Loco Members Found</p>
              ) : (
                recentBizs.map((locobiz) => (
                  <CurrentStatsBox
                    key={locobiz._id}
                    locobiz={locobiz}
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
