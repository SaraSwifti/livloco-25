'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export default function MessageList({ currentUserId }) {
  const [threads, setThreads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletionNotifications, setDeletionNotifications] = useState([])

  useEffect(() => {
    fetchThreads()
    fetchDeletionNotifications()
  }, [])

  const fetchDeletionNotifications = async () => {
    try {
      const response = await fetch('/api/messages/deletion-notifications')
      const result = await response.json()

      if (result.success) {
        setDeletionNotifications(result.notifications)
      }
    } catch (error) {
      console.error('Error fetching deletion notifications:', error)
    }
  }

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

  const dismissNotification = async (notificationId) => {
    try {
      const response = await fetch('/api/messages/deletion-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Remove the notification from the list
        setDeletionNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        )
      }
    } catch (error) {
      console.error('Error dismissing notification:', error)
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
    <div className='max-w-4xl mx-auto'>
      {/* Maximum messages limit notice - Thin banner */}
      <div className='bg-blue-50 border-b border-blue-200 px-4 py-2'>
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-blue-600'>📋</span>
          <span className='text-blue-700'>
            <strong>20 message limit:</strong> Delete old conversations to make
            room for new ones.
          </span>
        </div>
      </div>

      <div className='p-6'>
        {/* Deletion Notifications */}
        {deletionNotifications.length > 0 && (
          <div className='mb-6 space-y-3'>
            {deletionNotifications.map((notification) => (
              <div
                key={notification._id}
                className='p-4 bg-orange-50 border border-orange-200 rounded-lg'
              >
                <div className='flex items-start gap-3'>
                  <div className='text-orange-600 text-xl'>🗑️</div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-orange-800'>
                      Conversation Deleted
                    </h4>
                    <p className='text-sm text-orange-700 mt-1'>
                      {notification.deletedBy.full_name} has deleted your
                      conversation about{' '}
                      <span className='font-medium'>
                        {notification.threadInfo.postingName}
                      </span>
                      . You can start a new conversation with them anytime if
                      needed.
                    </p>
                    <div className='flex items-center gap-2 mt-2'>
                      <button
                        onClick={() => dismissNotification(notification._id)}
                        className='text-xs text-orange-600 hover:text-orange-800 underline'
                      >
                        Dismiss
                      </button>
                      <span className='text-xs text-orange-500'>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {threads.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-500 text-lg mb-4'>
              No conversations yet
            </div>
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
      </div>
    </div>
  )
}
