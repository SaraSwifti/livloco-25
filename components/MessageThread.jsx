'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function MessageThread({ threadId, currentUserId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [thread, setThread] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (threadId) {
      fetchThread()
      fetchMessages()
    }
  }, [threadId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/messages/thread/${threadId}`)
      const result = await response.json()

      if (result.success) {
        setThread(result.thread)
        setOtherUser(result.otherUser)
        setIsBlocked(result.thread.blockedBy !== null)
      }
    } catch (error) {
      console.error('Error fetching thread:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/thread/${threadId}/messages`)
      const result = await response.json()

      if (result.success) {
        setMessages(result.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || isBlocked) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          content: newMessage.trim(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setNewMessage('')
        fetchMessages()
        fetchThread() // Update thread info
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

  const blockUser = async () => {
    if (isLoading || isBlocked) return

    const confirmBlock = window.confirm(
      `Are you sure you want to block ${
        otherUser?.full_name || 'this user'
      }? This will prevent them from messaging you until you unblock them.`
    )

    if (!confirmBlock) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsBlocked(true)
        setThread((prev) => ({ ...prev, blockedBy: currentUserId }))
      } else {
        alert(result.error || 'Failed to block user')
      }
    } catch (error) {
      console.error('Error blocking user:', error)
      alert('Failed to block user')
    } finally {
      setIsLoading(false)
    }
  }

  const unblockUser = async () => {
    if (isLoading || !isBlocked) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsBlocked(false)
        setThread((prev) => ({ ...prev, blockedBy: null }))
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

  const deleteThread = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this entire conversation? This action cannot be undone.'
    )

    if (!confirmDelete) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/messages/delete-thread', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to messages list after successful deletion
        window.location.href = '/messages'
      } else {
        alert(result.error || 'Failed to delete conversation')
      }
    } catch (error) {
      console.error('Error deleting thread:', error)
      alert('Failed to delete conversation')
    } finally {
      setIsLoading(false)
    }
  }

  if (!thread || !otherUser) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full max-h-screen'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {/* Back Button */}
            <Link
              href='/messages'
              className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
            >
              <FaArrowLeft className='w-4 h-4' />
              <span className='text-sm font-medium'>Back to Messages</span>
            </Link>

            <div className='border-l border-gray-300 h-8'></div>

            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                {thread.postingName || 'Unknown'}
              </h2>
              <p className='text-sm text-gray-500'>
                Conversation with {otherUser.full_name} via{' '}
                {thread.postingType === 'business'
                  ? 'business listing'
                  : 'farmers market'}
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={deleteThread}
              disabled={isLoading}
              className='bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-3 py-1 rounded text-sm'
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            {isBlocked ? (
              <button
                onClick={unblockUser}
                disabled={isLoading}
                className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded text-sm'
              >
                {isLoading ? 'Unblocking...' : 'Unblock'}
              </button>
            ) : (
              <button
                onClick={blockUser}
                disabled={isLoading}
                className='bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-sm'
              >
                {isLoading ? 'Blocking...' : 'Block'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === currentUserId
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className='text-sm'>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender._id === currentUserId
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className='bg-white border-t border-gray-200 p-4'>
        {isBlocked ? (
          <div className='text-center text-gray-500 py-4'>
            This conversation is blocked. Unblock to continue messaging.
          </div>
        ) : (
          <form
            onSubmit={sendMessage}
            className='flex gap-2'
          >
            <div className='flex-1'>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type your message...'
                maxLength={100}
                className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                rows={2}
                disabled={isLoading}
              />
              <div className='text-xs text-gray-500 mt-1'>
                {newMessage.length}/100 characters
              </div>
            </div>
            <button
              type='submit'
              disabled={
                !newMessage.trim() || isLoading || newMessage.length > 100
              }
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200'
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}

        {/* Auto-deletion warning */}
        <div className='mt-2 text-xs text-gray-500 text-center'>
          <p>
            ⚠️ Message threads are automatically deleted after 6 months of
            inactivity. Messages are limited to 100 characters.
          </p>
        </div>
      </div>
    </div>
  )
}
