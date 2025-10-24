'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

export default function BlockedUsersList({ currentUserId }) {
  const [blockedUsers, setBlockedUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBlockedUsers()
  }, [])

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch('/api/messages/blocked')
      const result = await response.json()

      if (result.success) {
        setBlockedUsers(result.blockedUsers)
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const unblockUser = async (blockedUserId) => {
    try {
      const response = await fetch('/api/messages/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockedUserId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Remove the user from the blocked list
        setBlockedUsers((prev) =>
          prev.filter((user) => user.userId !== blockedUserId)
        )
        alert(
          'User unblocked successfully. You can now start a new conversation with them.'
        )
      } else {
        alert(result.error || 'Failed to unblock user')
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
      alert('Failed to unblock user')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading blocked users...</div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>
        Blocked For Messaging
      </h1>

      {blockedUsers.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg mb-4'>No blocked users</div>
          <p className='text-gray-400'>
            Users you block will appear here. You can unblock them to resume
            messaging.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {blockedUsers.map((user) => (
            <div
              key={user.userId}
              className='bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {user.fullName}
                    </h3>
                    <span className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full'>
                      Blocked
                    </span>
                  </div>
                  <p className='text-sm text-gray-500 mt-1'>
                    Blocked{' '}
                    {formatDistanceToNow(new Date(user.blockedAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    Originally connected via{' '}
                    {user.postingType === 'business'
                      ? 'business listing'
                      : 'farmers market'}
                    : {user.postingName}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => unblockUser(user.userId)}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
                  >
                    Unblock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <div className='text-blue-600 text-xl'>ℹ️</div>
          <div>
            <h4 className='font-semibold text-blue-800'>About Blocking</h4>
            <p className='text-sm text-blue-700 mt-1'>
              Blocked users cannot send you messages. When you unblock someone,
              you can resume messaging with them. Blocked conversations are
              preserved but cannot be continued until unblocked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
