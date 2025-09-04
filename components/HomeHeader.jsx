import Image from 'next/image';
import logo from '@/assets/images/newlivlocologo.png';

const HomeHeader = () => {
  return (
    <section className='py-0 mb-4'>
      <div className='bg-gray-800 max-w-7xl mx-auto py-3.5 px-3 sm:px-6 lg:px-8 flex flex-row items-center'>
        {/* Left side: Text (3/4) */}
        <div className='w-3/4 pr-4'>
          <h1 className='text-4xl font-extrabold text-white drop-shadow-2xl sm:text-5xl md:text-6xl'>
            Find Your LocoPeeps
          </h1>
          <p className='my-4 font-bold text-xl text-white drop-shadow-2xl'>
            Local businesses finding local businesses. Sustaining local
            economies right where you live.
          </p>
        </div>

        {/* Right side: Logo (1/4) */}
        <div className='w-1/4 flex justify-center'>
          {/* Swap with your actual logo */}
          <Image
            src={logo}
            alt='LivLoco logo'
            className='h-auto w-auto object-contain'
            width={200}
            height={200}
          />
        </div>
      </div>
    </section>
  )
}

export default HomeHeader
