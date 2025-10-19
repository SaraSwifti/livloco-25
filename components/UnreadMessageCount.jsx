'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function UnreadMessageCount() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/messages/unread-count')
        const result = await response.json()

        if (result.success) {
          setUnreadCount(result.unreadCount)
        }
      } catch (error) {
        console.error('Error fetching unread count:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnreadCount()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [session])

  // Mark messages as read when user navigates to messages page
  useEffect(() => {
    if (pathname === '/messages' && session?.user?.id && unreadCount > 0) {
      const markAsRead = async () => {
        try {
          await fetch('/api/messages/mark-all-read', {
            method: 'POST',
          })
          setUnreadCount(0) // Immediately update the count
        } catch (error) {
          console.error('Error marking messages as read:', error)
        }
      }

      markAsRead()
    }
  }, [pathname, session?.user?.id, unreadCount])

  // Don't show badge if no unread messages
  if (!session || isLoading || unreadCount === 0) {
    return null
  }

  return (
    <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}
