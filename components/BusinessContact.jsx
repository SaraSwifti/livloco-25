import Link from 'next/link'
import { FaGlobe, FaExternalLinkAlt } from 'react-icons/fa'

const BusinessContact = ({ locobiz, className = '' }) => {
  return (
    <>
      <div className={className}>
        <h1 className='text-3xl text-center pb-4 font-bold'>
          {' '}
          Contact Information for {locobiz.locobiz_name}
        </h1>
        {/* This is where I am going to add the chance to message the member through the platform */}
        <h1 className='text-center'>
          This is where they will message the member on Livloco platform
        </h1>
        {(locobiz?.website || '').trim() !== '' ? (
          <div className='flex justify-center items-center'>
            <Link
              href={locobiz.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-2xl font-bold inline-flex items-center space-x-2 text-blue-800 hover:text-blue-900 underline'
            >
              <FaGlobe className='w-6 h-6 text-blue-800 hover:text-blue-900 cursor-pointer' />
              <span>Website for {locobiz.locobiz_name}</span>
            
               <FaExternalLinkAlt aria-hidden className="w-4 h-4 opacity-80" />
            </Link>
          </div>
        ) : null}


      </div>
    </>
  )
}

export default BusinessContact
