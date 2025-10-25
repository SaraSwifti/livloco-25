'use client'

import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/images/newlivlocologo.png'
import AuthButtons from './AuthButtons'
import { useSession } from 'next-auth/react'

const HomeHeader = () => {
  const { data: session } = useSession()

  return (
    <div className='-mx-4 -mt-8'>
      {/* Hero Section with Search - Full Width */}
      <section className='mb-4 relative'>
        <div className='w-full bg-gradient-to-r from-green-700 via-emerald-700 to-sky-700 relative'>
          <div className='max-w-7xl py-12 pb-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center relative z-10'>
            {/* Text + Auth Buttons: 3/4 on md+, full on mobile */}
            <div className='order-2 md:order-1 w-full md:w-3/4 md:pr-6 text-center md:text-left'>
              <h1 className='text-2xl font-extrabold drop-shadow-2xl text-white sm:text-3xl md:text-4xl'>
                Find Your LocoPeeps
              </h1>
              <p className='my-2 font-bold drop-shadow-2xl text-sm text-white'>
                Local businesses finding local businesses. Sustaining local
                economies right where you live.
              </p>

              {/* Authentication Buttons - Only show if not signed in */}
              {!session && (
                <div className='mt-6'>
                  <AuthButtons />
                </div>
              )}

              {/* Explore Members Button - Show for everyone */}
              <div className='mt-6'>
                <Link
                  href='/recent-members'
                  className='inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30'
                >
                  Explore our latest members
                </Link>
              </div>
            </div>

            {/* Logo: top-center on mobile, right 1/4 on md+ */}
            <div className='order-1 md:order-2 w-full md:w-1/4 mb-2 md:mb-0 flex justify-center md:justify-end'>
              <div className='bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-lg w-48 h-48 flex items-center justify-center'>
                <Image
                  src={logo}
                  alt='LivLoco logo'
                  className='h-auto w-auto object-contain'
                  width={160}
                  height={160}
                />
              </div>
            </div>
          </div>

          {/* Wavy bottom design */}
          <div className='absolute bottom-0 left-0 w-full overflow-hidden'>
            <svg
              className='relative block w-full h-20'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <defs>
                <linearGradient
                  id='waveGradient'
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
                    offset='30%'
                    style={{ stopColor: '#047857', stopOpacity: 1 }}
                  />
                  <stop
                    offset='60%'
                    style={{ stopColor: '#15803d', stopOpacity: 1 }}
                  />
                  <stop
                    offset='100%'
                    style={{ stopColor: '#15803d', stopOpacity: 1 }}
                  />
                </linearGradient>
              </defs>
              <path
                d='M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z'
                fill='url(#waveGradient)'
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

export default HomeHeader
