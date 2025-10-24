'use client'

import { useState } from 'react'

export default function AdminSetup() {
  const [adminEmail, setAdminEmail] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail,
          secretKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        setResult(data)
      }
    } catch (error) {
      console.error('Setup error:', error)
      setResult({
        success: false,
        error: `Network error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Admin Account Setup
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Promote a user account to admin access
          </p>
        </div>

        <form
          className='mt-8 space-y-6'
          onSubmit={handleSubmit}
        >
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label
                htmlFor='adminEmail'
                className='sr-only'
              >
                Admin Email
              </label>
              <input
                id='adminEmail'
                name='adminEmail'
                type='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Enter the email to promote to admin'
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='secretKey'
                className='sr-only'
              >
                Secret Key
              </label>
              <input
                id='secretKey'
                name='secretKey'
                type={showPassword ? 'text' : 'password'}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Enter secret key: livloco-admin-2024'
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-5 w-5 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className='space-y-3'>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400'
            >
              {isLoading ? 'Setting up...' : 'Promote to Admin'}
            </button>

            <button
              type='button'
              onClick={async () => {
                try {
                  const response = await fetch('/api/admin/test')
                  const data = await response.json()
                  alert(`Test result: ${JSON.stringify(data, null, 2)}`)
                } catch (error) {
                  alert(`Test error: ${error.message}`)
                }
              }}
              className='w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Test Connection
            </button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-md ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div
                className={`text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.success ? (
                  <div>
                    <p className='font-medium'>✅ Success!</p>
                    <p>{result.message}</p>
                    <p className='mt-2'>
                      <a
                        href='/admin'
                        className='text-blue-600 hover:text-blue-800 underline'
                      >
                        Go to Admin Dashboard →
                      </a>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className='font-medium'>❌ Error:</p>
                    <p>{result.error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className='text-xs text-gray-500 text-center'>
            <p>
              <strong>Secret Key:</strong> livloco-admin-2024
            </p>
            <p className='mt-1'>
              Make sure the email account exists and you're signed in with it.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
