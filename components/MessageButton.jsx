'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MessageButton({
  postingType,
  postingId,
  recipientId,
  postingName,
  currentUserId,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isBlockedByCurrentUser, setIsBlockedByCurrentUser] = useState(false)
  const [isBlockedByRecipient, setIsBlockedByRecipient] = useState(false)
  const [checkingBlocked, setCheckingBlocked] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkBlockedState()
  }, [postingType, postingId, recipientId])

  const checkBlockedState = async () => {
    try {
      const response = await fetch('/api/messages/check-blocked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postingType,
          postingId,
          recipientId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsBlockedByCurrentUser(result.isBlockedByCurrentUser)
        setIsBlockedByRecipient(result.isBlockedByRecipient)
      }
    } catch (error) {
      console.error('Error checking blocked state:', error)
    } finally {
      setCheckingBlocked(false)
    }
  }

  const handleMessage = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/create-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postingType,
          postingId,
          recipientId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        if (result.existing) {
          // Navigate to existing thread
          router.push(`/messages/${result.threadId}`)
        } else {
          // Navigate to compose page for new conversation
          router.push(result.composeUrl)
        }
      } else {
        alert(result.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error creating message thread:', error)
      alert('Failed to start conversation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockedUserId: recipientId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        window.location.reload() // Refresh to update button state
      } else {
        alert(result.error || 'Failed to unblock user')
      }
    } catch (error) {
      console.error('Error unblocking user:', error)
      alert('Failed to unblock user')
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button if current user is viewing their own posting
  if (currentUserId === recipientId) {
    return null
  }

  // Show loading state while checking blocked status
  if (checkingBlocked) {
    return (
      <button
        disabled
        className='bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-not-allowed'
      >
        Loading...
      </button>
    )
  }

  // Show blocked state button if current user has blocked this user
  if (isBlockedByCurrentUser) {
    return (
      <button
        disabled
        className='bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-not-allowed'
      >
        You have blocked messaging this{' '}
        {postingType === 'business' ? 'business' : 'market'}
      </button>
    )
  }

  // Show blocked state button if this user has blocked the current user
  if (isBlockedByRecipient) {
    return (
      <button
        disabled
        className='bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 cursor-not-allowed'
      >
        No messaging available
      </button>
    )
  }

  return (
    <button
      onClick={handleMessage}
      disabled={isLoading}
      className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200'
    >
      {isLoading ? 'Opening conversation...' : `Message ${postingName}`}
    </button>
  )
}
