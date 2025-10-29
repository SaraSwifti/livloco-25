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
      <section className='mb-0 relative'>
        <div
          className='w-full bg-gradient-to-l from-yellow-600 via-blue-400 to-sky-700 relative'
          style={{
            background:
              'linear-gradient(to left, #d97706 0%, #fbbf24 20%, #7dd3fc 60%, #0284c7 100%)',
          }}
        >
          <div className='max-w-7xl py-12 pb-20 mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            {/* Desktop Layout: 3 columns */}
            <div className='hidden md:flex items-center justify-between gap-6'>
              {/* Section 1: Find Your LocoPeeps + Subtext */}
              <div className='flex-1 text-left'>
                <h1 className='text-pretty text-4xl font-semibold tracking-tight text-black sm:text-5xl'>
                  <div className='text-black'>Find Your</div>
                  <div
                    className='bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 bg-clip-text text-transparent'
                    style={{ WebkitTextStroke: '0.3px black' }}
                  >
                    LocoPeeps
                  </div>
                </h1>
                <div className='text-xl/8 text-black my-2'>
                  Members and local businesses finding local businesses.
                  <br />
                  Building sustainable economies right where you live.
                </div>
              </div>

              {/* Section 2: Explore Button and Register Button - Centered */}
              <div className='flex-shrink-0 flex flex-col items-center justify-center gap-5'>
                <Link
                  href='/recent-members'
                  className='inline-flex items-center px-8 py-4 bg-white/50 backdrop-blur-md text-black text-base font-semibold rounded-lg transition-all duration-300 hover:bg-white/40'
                >
                  Explore our newest members' postings
                </Link>
                {!session && (
                  <Link
                    href='/onboarding'
                    className='inline-flex items-center px-8 py-4 bg-white/50 backdrop-blur-md text-black text-base font-semibold rounded-lg border-2 border-black transition-all duration-300 hover:bg-white/40'
                  >
                    Register to become a Livloco Co-op Member
                  </Link>
                )}
              </div>

              {/* Section 3: Logo */}
              <div className='flex-1 flex justify-end'>
                <div className='bg-white/10 backdrop-blur-sm rounded-full p-16 shadow-lg w-96 h-96 flex items-center justify-center absolute bottom-0 right-8 overflow-visible'>
                  <Image
                    src={logo}
                    alt='LivLoco logo'
                    className='h-auto w-auto object-contain'
                    width={320}
                    height={320}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Layout: Stacked */}
            <div className='flex flex-col md:hidden items-center'>
              {/* Section 3: Logo (Top on mobile) */}
              <div className='mb-4'>
                <div className='bg-white/20 backdrop-blur-sm rounded-full p-16 shadow-lg w-96 h-96 flex items-center justify-center'>
                  <Image
                    src={logo}
                    alt='LivLoco logo'
                    className='h-auto w-auto object-contain'
                    width={320}
                    height={320}
                  />
                </div>
              </div>

              {/* Section 1: Find Your LocoPeeps + Subtext (Middle on mobile) */}
              <div className='text-center mb-4'>
                <h1 className='text-pretty text-4xl font-semibold tracking-tight text-black sm:text-5xl'>
                  <div className='text-black'>Find Your</div>
                  <div
                    className='bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 bg-clip-text text-transparent'
                    style={{ WebkitTextStroke: '0.3px black' }}
                  >
                    LocoPeeps
                  </div>
                </h1>
                <div className='text-xl/8 text-black my-2'>
                  Members and local businesses finding local businesses.
                  <br />
                  Building sustainable economies right where you live.
                </div>
                {/* Join the Co-op Button for mobile */}
                {!session && (
                  <div className='mt-4'>
                    <AuthButtons />
                  </div>
                )}
              </div>

              {/* Section 2: Explore Button and Register Button (Bottom on mobile) */}
              <div className='flex flex-col gap-5 items-center'>
                <Link
                  href='/recent-members'
                  className='inline-flex items-center px-8 py-4 bg-white/50 backdrop-blur-md text-black text-base font-semibold rounded-lg transition-all duration-300 hover:bg-white/40'
                >
                  Explore our newest members' postings
                </Link>
                {!session && (
                  <Link
                    href='/onboarding'
                    className='inline-flex items-center px-8 py-4 bg-white/50 backdrop-blur-md text-black text-base font-semibold rounded-lg border-2 border-black transition-all duration-300 hover:bg-white/40'
                  >
                    Register to become a Livloco Co-op Member
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Wavy bottom design - wave going down */}
          <div className='absolute bottom-0 left-0 w-full overflow-visible'>
            <svg
              className='relative block w-full h-10'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1200 120'
              preserveAspectRatio='none'
            >
              <defs>
                <linearGradient
                  id='homeHeaderWave'
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
                fill='url(#homeHeaderWave)'
              ></path>
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeHeader
