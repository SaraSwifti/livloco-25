'use client'

import { useState, useEffect } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { FaGoogle, FaApple } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import Link from 'next/link'

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

  const hasGoogle = providers.google
  const hasApple = providers.apple
  const hasCredentials = providers.credentials

  return (
    <div className='flex flex-col items-center gap-3'>
      {/* OAuth Buttons */}
      <div className='flex flex-col gap-2 w-full'>
        {hasGoogle && (
          <button
            onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
            className='inline-flex items-center justify-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200'
          >
            <FaGoogle className='mr-2 h-4 w-4' />
            Continue with Google
          </button>
        )}

        {hasApple && (
          <button
            onClick={() => signIn('apple', { callbackUrl: '/onboarding' })}
            className='inline-flex items-center justify-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200'
          >
            <FaApple className='mr-2 h-4 w-4' />
            Continue with Apple
          </button>
        )}
      </div>

      {/* Email/Password Option */}
      {hasCredentials && (
        <div className='w-full'>
          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-white/30'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-transparent text-white'>or</span>
            </div>
          </div>
          <Link
            href='/auth/register'
            className='inline-flex items-center justify-center w-full px-4 py-2 border border-white text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200'
          >
            <MdEmail className='mr-2 h-4 w-4' />
            Sign up with Email
          </Link>
          <p className='text-center text-sm text-white/80 mt-2'>
            Already have an account?{' '}
            <Link
              href='/api/auth/signin'
              className='underline hover:text-white'
            >
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default AuthButtons
