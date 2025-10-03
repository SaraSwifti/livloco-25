'use client'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/assets/images/newlivlocologo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className='bg-gray-800 text-white text-center mb-10 p-4 shrink-0'>
      <div className=' bg-white rounded-lg shadow m-4 w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between'>
        <div className='mb-4 md:mb-0'>
          <Image
            src={logo}
            alt='Logo'
            className='h-8 w-auto'
          />
        </div>
        <div className='flex flex-wrap justify-center md:justify-start mb-4 md:mb-0'>
          <ul className='flex space-x-4'>
            {/* <li><Link href="/properties.html">Properties</Link></li> */}
            <li>
              <Link
                className='text-black'
                href='mailto:sara.swifti@gmail.com'
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className='text-sm text-black mt-2 md:mt-0'>
            &copy;{currentYear} LivLoco. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
