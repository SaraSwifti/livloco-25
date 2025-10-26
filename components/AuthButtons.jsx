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
        className='inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200'
      >
        <FaGoogle className='mr-2 h-4 w-4' />
        Join the Livloco Co-op
      </button>
    </div>
  )
}

export default AuthButtons
