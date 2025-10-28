'use client'

import Image from 'next/image'
import logo from '@/assets/images/newlivlocologo.png'

const MoreLessHero = () => {
  return (
    <div className='-mx-4 -mt-20'>
      {/* Hero Section - Full Width */}
      <section
        className='mb-0 relative'
        style={{ marginBottom: '-80px' }}
      >
        {/* Wavy top design - wave going up to connect with HomeHeader */}
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
                id='moreLessHeroWave'
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
              fill='url(#moreLessHeroWave)'
            ></path>
          </svg>
        </div>

        <div
          className='w-full relative'
          style={{
            background:
              'linear-gradient(to right, #0369a1 0%, #60a5fa 50%, #ca8a04 100%)',
          }}
        >
          <div
            className='max-w-7xl py-12 pb-10 mx-auto px-4 sm:px-6 lg:px-8 relative z-10'
            style={{ marginTop: '80px' }}
          >
            {/* Three Section Layout */}
            <div className='flex flex-col md:flex-row gap-8'>
              {/* Left Section - More */}
              <div className='flex-1 text-white drop-shadow-lg'>
                <h2 className='text-3xl font-bold mb-4'>More....</h2>
                <p className='text-sm font-semibold'>
                  Knowing your neighbor, local business, community, their needs.
                </p>
                <p className='text-sm font-semibold mt-2'>
                  Growing in our sustainability, interdependence, ....peace.
                </p>
              </div>

              {/* Middle Section - Less is More */}
              <div className='flex-1 text-center md:text-left'>
                <h1 className='text-2xl font-extrabold drop-shadow-2xl sm:text-3xl md:text-4xl'>
                  <span className='text-white'>Less is </span>
                  <span className='bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 bg-clip-text text-transparent'>
                    More
                  </span>
                </h1>
              </div>

              {/* Right Section - Less */}
              <div className='flex-1 text-white drop-shadow-lg'>
                <h2 className='text-3xl font-bold mb-4'>Less....</h2>
                <p className='text-sm font-semibold'>
                  Distance, Transport, Energy, Pollution
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
                id='moreLessHeroWaveBottom'
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
              fill='url(#moreLessHeroWaveBottom)'
            />
          </svg>
        </div>
      </section>
    </div>
  )
}

export default MoreLessHero
