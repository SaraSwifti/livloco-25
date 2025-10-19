'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function MessageList({ currentUserId }) {
  const [threads, setThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThreads()
  }, [])

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/messages/threads')
      const result = await response.json()

      if (result.success) {
        setThreads(result.threads)
      }
    } catch (error) {
      console.error('Error fetching threads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteThread = async (threadId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this entire conversation? This action cannot be undone.'
    )

    if (!confirmDelete) return

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
        // Remove the thread from the list
        setThreads((prev) => prev.filter((thread) => thread._id !== threadId))
      } else {
        alert(result.error || 'Failed to delete conversation')
      }
    } catch (error) {
      console.error('Error deleting thread:', error)
      alert('Failed to delete conversation')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading conversations...</div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {threads.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg mb-4'>No conversations yet</div>
          <p className='text-gray-400'>
            Start a conversation by messaging someone from their business or
            farmers market listing.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {threads.map((thread) => {
            const otherUser = thread.participants.find(
              (p) => p._id !== currentUserId
            )
            const isBlocked = thread.blockedBy !== null

            return (
              <div
                key={thread._id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200'
              >
                <div className='flex items-center justify-between'>
                  <Link
                    href={`/messages/${thread._id}`}
                    className='flex-1'
                  >
                    <div className='flex items-center gap-3'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {otherUser?.full_name || 'Unknown User'}
                      </h3>
                      {isBlocked && (
                        <span className='bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full'>
                          {thread.blockedBy === currentUserId
                            ? 'Blocked by you'
                            : 'You are blocked'}
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-500'>
                      Started via{' '}
                      {thread.postingType === 'business'
                        ? 'business listing'
                        : 'farmers market'}
                    </p>
                    {thread.lastMessage && (
                      <p className='text-sm text-gray-700 mt-1 truncate'>
                        {thread.lastMessage.content}
                      </p>
                    )}
                  </Link>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-sm text-gray-500'>
                        {formatDistanceToNow(new Date(thread.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {!thread.lastMessage?.read &&
                        thread.lastMessage?.sender !== currentUserId && (
                          <div className='w-3 h-3 bg-blue-600 rounded-full mt-1 ml-auto'></div>
                        )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        deleteThread(thread._id)
                      }}
                      className='bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200'
                      title='Delete conversation'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Auto-deletion warning */}
      <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <div className='flex items-start gap-3'>
          <div className='text-yellow-600 text-xl'>⚠️</div>
          <div>
            <h4 className='font-semibold text-yellow-800'>
              Auto-Deletion Notice
            </h4>
            <p className='text-sm text-yellow-700 mt-1'>
              Message threads are automatically deleted after 6 months from the
              last message, or if a member is deleted, whichever comes first.
              Messages are limited to 100 characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
