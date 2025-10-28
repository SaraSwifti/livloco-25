'use client'

import Image from 'next/image'
import logo from '@/assets/images/newlivlocologo.png'

const AlternatingWaveHero = ({ 
  sections = [
    {
      gradient: 'linear-gradient(to left, #ca8a04 0%, #fbbf24 20%, #60a5fa 60%, #0c4a6e 100%)',
      waveGradient: ['#0369a1', '#0ea5e9', '#ca8a04'],
      content: null // Optional content
    },
    {
      gradient: 'linear-gradient(to right, #ca8a04 0%, #fbbf24 20%, #60a5fa 60%, #0c4a6e 100%)',
      waveGradient: ['#ca8a04', '#fbbf24', '#0369a1'],
      content: null // Optional content
    }
  ]
}) => {
  return (
    <div className='-mx-4'>
      {sections.map((section, index) => (
        <div key={index} className='mb-4'>
          {/* Hero Section */}
          <section className='relative'>
            <div
              className='w-full relative'
              style={{
                background: section.gradient,
              }}
            >
              <div className='max-w-7xl py-12 pb-10 mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                {/* Content Area */}
                {section.content && (
                  <div className='flex items-center justify-center'>
                    {section.content}
                  </div>
                )}
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
                      id={`waveGradient${index}`}
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='0%'
                    >
                      <stop
                        offset='0%'
                        style={{ stopColor: section.waveGradient[0], stopOpacity: 1 }}
                      />
                      <stop
                        offset='50%'
                        style={{ stopColor: section.waveGradient[1], stopOpacity: 1 }}
                      />
                      <stop
                        offset='100%'
                        style={{ stopColor: section.waveGradient[2], stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d='M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z'
                    fill={`url(#waveGradient${index})`}
                    stroke='white'
                    strokeWidth='4'
                  ></path>
                </svg>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  )
}

export default AlternatingWaveHero

