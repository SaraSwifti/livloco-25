'use client'

import { useState, useEffect } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'

const AuthButtons = () => {
  const [providers, setProviders] = useState(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  if (!providers) {
    return (
      <div className='flex space-x-4'>
        <div className='animate-pulse bg-gray-200 h-10 w-24 rounded-md'></div>
        <div className='animate-pulse bg-gray-200 h-10 w-24 rounded-md'></div>
      </div>
    )
  }

  return (
    <div className='flex justify-center'>
      {/* Join the Co-op Button */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
        className='inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg'
      >
        <FaGoogle className='mr-3 h-6 w-6' />
        Join the Co-op
      </button>
    </div>
  )
}

export default AuthButtons
