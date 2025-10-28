'use client'

import Image from 'next/image'
import logo from '@/assets/images/newlivlocologo.png'

const MoreLessHero = () => {
  return (
    <div className='-mx-4 -mt-8'>
      {/* Hero Section - Full Width */}
      <section className='mb-4 relative'>
        <div
          className='w-full relative'
          style={{
            background:
              'linear-gradient(to right, #ca8a04 0%, #fbbf24 20%, #60a5fa 60%, #0c4a6e 100%)',
          }}
        >
          <div className='max-w-7xl py-12 pb-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col relative z-10'>
            {/* "Less is More" Text - Top */}
            <div className='flex'>
              <div className='w-2/3'></div>
              <div className='w-1/3 text-center md:text-left'>
                <h1 className='text-2xl font-extrabold drop-shadow-2xl sm:text-3xl md:text-4xl'>
                  <span className='text-white'>Less is </span>
                  <span className='bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 bg-clip-text text-transparent'>
                    More
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Wavy bottom design - Opposite gradient from main background */}
          <div className='absolute bottom-0 left-0 w-full overflow-hidden'>
            {/* "More...." Text - Positioned in the wave bulge area */}
            <div className='absolute top-1/2 left-8 w-1/3 text-white text-sm font-semibold drop-shadow-lg z-20'>
              <p>More....</p>
              <p className='mt-2'>
                Knowing your neighbor, local business, community, their needs.
              </p>
              <p className='mt-1'>
                Growing in our sustainability, interdependence, ....peace.
              </p>
            </div>
            <svg
              className='relative block w-full h-40'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <defs>
                <linearGradient
                  id='moreLessWaveGradient'
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
                    style={{ stopColor: '#0ea5e9', stopOpacity: 1 }}
                  />
                  <stop
                    offset='100%'
                    style={{ stopColor: '#ca8a04', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                d='M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z'
                fill='url(#moreLessWaveGradient)'
                stroke='white'
                strokeWidth='4'
              ></path>
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MoreLessHero
