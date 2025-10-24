'use client'

import { useState, useEffect } from 'react'

export default function AdminDebug() {
  const [debugInfo, setDebugInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  const fetchDebugInfo = async () => {
    try {
      // Check session
      const sessionResponse = await fetch('/api/me')
      const sessionData = await sessionResponse.json()

      // Check admin status
      const adminResponse = await fetch('/api/admin/status')
      const adminData = await adminResponse.json()

      // Test admin endpoint
      const testResponse = await fetch('/api/admin/test')
      const testData = await testResponse.json()

      setDebugInfo({
        session: sessionData,
        adminStatus: adminData,
        testEndpoint: testData,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-gray-500'>Loading debug info...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Admin Debug Information
        </h1>

        <div className='bg-white rounded-lg shadow p-6'>
          <pre className='whitespace-pre-wrap text-sm text-gray-800'>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className='mt-6 flex space-x-4'>
          <button
            onClick={fetchDebugInfo}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'
          >
            Refresh Debug Info
          </button>

          <a
            href='/admin'
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-block'
          >
            Go to Admin Dashboard
          </a>

          <a
            href='/admin/setup'
            className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg inline-block'
          >
            Go to Admin Setup
          </a>
        </div>
      </div>
    </div>
  )
}
