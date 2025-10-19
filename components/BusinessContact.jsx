import Link from 'next/link'
import { FaGlobe, FaExternalLinkAlt } from 'react-icons/fa'
import MessageButton from './MessageButton'

const BusinessContact = ({ locobiz, className = '', messageButtonProps }) => {
  return (
    <>
      <div className={className}>
        <h1 className='text-3xl text-center pb-4 font-bold'>
          {' '}
          Contact Information for {locobiz.locobiz_name}
        </h1>
        {/* Message Button */}
        {messageButtonProps && (
          <div className='flex justify-center items-center mb-4'>
            <MessageButton {...messageButtonProps} />
          </div>
        )}
        {(locobiz?.website || '').trim() !== '' ? (
          <div className='flex justify-center items-center'>
            <Link
              href={locobiz.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-2xl font-bold inline-flex items-center space-x-2 text-blue-800 hover:text-blue-900 underline'
              title={`Open website for ${locobiz.locobiz_name}`}
            >
              <FaGlobe className='w-6 h-6 text-blue-800 hover:text-blue-900 cursor-pointer' />
              <span>Website for {locobiz.locobiz_name}</span>

              <FaExternalLinkAlt
                aria-hidden
                className='w-4 h-4 opacity-80'
              />
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default BusinessContact
