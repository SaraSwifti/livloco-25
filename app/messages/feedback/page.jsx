'use client'

import { useState, useEffect } from 'react'
import MessagesNavBar from '@/components/MessagesNavBar'
import FeedbackForm from '@/components/FeedbackForm'
import { useSession } from 'next-auth/react'

export default function FeedbackPage() {
  const { data: session } = useSession()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/me')
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    }

    fetchUser()
  }, [session])

  if (!session) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Sign In Required
            </h2>
            <p className='text-gray-600'>Please sign in to submit feedback</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <MessagesNavBar />
      <div className='max-w-4xl mx-auto p-6'>
        {user && <FeedbackForm user={user} />}
      </div>
    </div>
  )
}
