'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function ComposeMessage() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const postingType = searchParams.get('postingType')
  const postingId = searchParams.get('postingId')
  const recipientId = searchParams.get('recipientId')
  const postingName = searchParams.get('postingName')

  useEffect(() => {
    if (!postingType || !postingId || !recipientId || !postingName) {
      router.push('/messages')
      return
    }

    // Fetch recipient info
    fetchRecipientInfo()
  }, [postingType, postingId, recipientId])

  const fetchRecipientInfo = async () => {
    try {
      const response = await fetch(`/api/users/${recipientId}`)
      const result = await response.json()

      if (result.success) {
        setRecipientInfo(result.user)
      }
    } catch (error) {
      console.error('Error fetching recipient info:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/send-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postingType,
          postingId,
          recipientId,
          content: message.trim(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Navigate to the newly created thread
        router.push(`/messages/${result.threadId}`)
      } else {
        alert(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  if (!postingType || !postingId || !recipientId || !postingName) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full max-h-screen'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center gap-4'>
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
          >
            <FaArrowLeft className='w-4 h-4' />
            <span className='text-sm font-medium'>Back</span>
          </button>

          <div className='border-l border-gray-300 h-8'></div>

          <div>
            <h2 className='text-xl font-bold text-gray-900'>New Message</h2>
            <p className='text-sm text-gray-500'>
              To {recipientInfo?.full_name || 'Unknown'} via{' '}
              {postingType === 'business'
                ? 'business listing'
                : 'farmers market'}
              : {postingName}
            </p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className='flex-1 bg-white p-4'>
        <form
          onSubmit={sendMessage}
          className='flex flex-col h-full'
        >
          <div className='flex-1 mb-4'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type your message...'
              maxLength={100}
              className='w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              disabled={isLoading}
            />
            <div className='text-xs text-gray-500 mt-2'>
              {message.length}/100 characters
            </div>
          </div>

          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => router.back()}
              disabled={isLoading}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!message.trim() || isLoading || message.length > 100}
              className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200'
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

