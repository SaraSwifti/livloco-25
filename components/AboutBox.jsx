import connectDB from '@/config/database'
import LocoBizsCountDisplay from '@/components/LocoBizsCountDisplay'
import MemberCountDisplay from '@/components/MemberCountDisplay'
import HostFarmersMarketCountDisplay from '@/components/HostFarmersMarkCountDisplay'
import User from '@/models/User'
import locoBiz from '@/models/LocoBiz'
import hostFMarkets from '@/models/HostFMarket'

const AboutBox = async () => {
  await connectDB()

  let totalLocoBizs = 0
  let totalFarmersMarkets = 0
  let totalUsers = 0

  try {
    totalLocoBizs = await locoBiz.countDocuments({ locobiz_active: true })
    totalFarmersMarkets = await hostFMarkets.countDocuments({
      hostfm_active: true,
    })
    // Count members based on users; add a filter if "joined" means paid members only.
    totalUsers = await User.countDocuments({
      /* payment_confirmed: true */
    })
  } catch (error) {
    console.log('Error fetching stats for AboutBox:', error)
  }

  return (
    <div className='-mx-4 -mt-16'>
      <section
        className='mb-0 relative'
        style={{ marginTop: '-40px' }}
      >
        {/* Wavy top design - wave going up to connect with MoreLessHero */}
        <div
          className='absolute top-0 left-0 w-full overflow-hidden'
          style={{ height: '40px', zIndex: 1 }}
        >
          <svg
            className='relative block w-full h-10'
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
            style={{ transform: 'rotate(180deg)' }}
          >
            <defs>
              <linearGradient
                id='aboutBoxWave'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
              >
                <stop
                  offset='0%'
                  style={{ stopColor: '#0369a1', stopOpacity: 1 }}
                />
                <stop
                  offset='50%'
                  style={{ stopColor: '#fbbf24', stopOpacity: 1 }}
                />
                <stop
                  offset='100%'
                  style={{ stopColor: '#ca8a04', stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <path
              d='M0,60 Q300,100 600,60 T1200,60 L1200,120 L0,120 Z'
              fill='url(#aboutBoxWave)'
            />
          </svg>
        </div>

        <div
          className='w-full relative'
          style={{
            background:
              'linear-gradient(to right, #075985 0%, #60a5fa 20%, #fbbf24 60%, #ca8a04 100%)',
          }}
        >
          <div
            className='mx-auto -mt-12 max-w-7xl p-10 sm:mt-0 lg:px-8 xl:-mt-8'
            style={{ marginTop: '80px' }}
          >
            <div className='mx-auto rounded bg-transparent p-10 max-w-2xl lg:mx-0 lg:max-w-none'>
              <div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
                {/* Left Section - At the LivLoco Co-op */}
                <div className='flex-1 text-black'>
                  <h3
                    className='text-pretty pb-3 text-4xl font-semibold tracking-tight bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent sm:text-5xl'
                    style={{ WebkitTextStroke: '0.3px black' }}
                  >
                    At the LivLoco Co-op:
                  </h3>
                  <ul className='list-disc ml-6 space-y-2'>
                    <li className='text-xl/8 text-black'>
                      <span className='font-bold text-2xl'>
                        Everyone has a seat at the table,
                      </span>{' '}
                      regardless of how large or small your business is.
                    </li>
                    <li className='text-xl/8 text-black'>
                      You can be a member without posting a LocoBusiness or
                      LocoFarmers' Market, and just look around. Post one or the
                      other should you change your mind, as it is included in
                      the membership.
                    </li>
                    <li className='text-xl/8 text-black'>
                      Yearly memberships are $35/year with the ability to post
                      up to three items you would like to sell and up to three
                      items that you are needing to make your business more
                      locally sustainable.
                    </li>
                    <li className='text-xl/8 text-black'>
                      No Transactions- do those between yourselves.
                    </li>
                    <li className='text-xl/8 text-black'>
                      {' '}
                      No dispearaging comment sections. If you didn't like the
                      service, don't vote for them and don't use them again.{' '}
                      <span className='font-bold text-2xl'>
                        It is that simple.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Middle Section - LivLoco's Current Stats */}
                <div className='flex-1 flex items-center justify-center'>
                  <div className='bg-white/20 backdrop-blur-sm p-6 rounded-lg text-center'>
                    <h2 className='text-4xl font-bold text-black mb-4'>
                      LivLoco's Current Stats
                    </h2>
                    <div className='flex flex-col gap-2'>
                      {/* Make this counter dynamic */}
                      {/* NEW: Members counter based on total users */}
                      <MemberCountDisplay total={totalUsers} />
                      <LocoBizsCountDisplay total={totalLocoBizs} />
                      <HostFarmersMarketCountDisplay
                        total={totalFarmersMarkets}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Section - I hope that... */}
                <div className='flex-1 text-black'>
                  <h3
                    className='text-pretty pb-3 text-4xl font-semibold tracking-tight bg-gradient-to-r from-green-700 via-lime-500 to-green-700 bg-clip-text text-transparent sm:text-5xl'
                    style={{ WebkitTextStroke: '0.3px black' }}
                  >
                    I hope that...
                  </h3>
                  <p className='text-xl/8 text-black'>
                    You find this helpful. We can make an app for this site
                    someday. We can offer scholarships to those wanting to learn
                    a new trade, regardless of age. Together, the possibilities
                    are endless!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wavy bottom design - wave going down */}
          <div className='absolute bottom-0 left-0 w-full overflow-hidden'>
            <svg
              className='relative block w-full h-10'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <defs>
                <linearGradient
                  id='aboutBoxWaveBottom'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='0%'
                >
                  <stop
                    offset='0%'
                    style={{ stopColor: '#ca8a04', stopOpacity: 1 }}
                  />
                  <stop
                    offset='50%'
                    style={{ stopColor: '#fbbf24', stopOpacity: 1 }}
                  />
                  <stop
                    offset='100%'
                    style={{ stopColor: '#0369a1', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                d='M0,60 Q300,100 600,60 T1200,60 L1200,120 L0,120 Z'
                fill='url(#aboutBoxWaveBottom)'
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutBox
