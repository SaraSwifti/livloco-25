'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MessagesNavBar() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(() => {
    if (pathname.includes('/blocked')) return 'blocked'
    if (pathname.includes('/feedback')) return 'feedback'
    return 'messages'
  })

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-4xl mx-auto px-6'>
        <nav
          className='flex'
          aria-label='Tabs'
        >
          <Link
            href='/messages'
            onClick={() => handleTabClick('messages')}
            className={`flex-1 py-4 px-4 text-center text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-transparent text-black bg-white'
                : 'border-transparent text-black bg-gray-300 hover:bg-gray-200'
            }`}
          >
            Messages
          </Link>
          <Link
            href='/messages/blocked'
            onClick={() => handleTabClick('blocked')}
            className={`flex-1 py-4 px-4 text-center text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'blocked'
                ? 'border-transparent text-black bg-white'
                : 'border-transparent text-black bg-gray-300 hover:bg-gray-200'
            }`}
          >
            Blocked For Messaging
          </Link>
          <Link
            href='/messages/feedback'
            onClick={() => handleTabClick('feedback')}
            className={`flex-1 py-4 px-4 text-center text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'feedback'
                ? 'border-transparent text-black bg-white'
                : 'border-transparent text-black bg-gray-300 hover:bg-gray-200'
            }`}
          >
            Submit Feedback to Site Admins
          </Link>
        </nav>
      </div>
    </div>
  )
}
