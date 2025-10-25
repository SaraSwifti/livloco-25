'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaTimes, FaHeart, FaUser } from 'react-icons/fa'

export default function SavedItemPopup({
  isOpen,
  onClose,
  itemType = 'business',
}) {
  const [hasSeenPopup, setHasSeenPopup] = useState(false)

  useEffect(() => {
    // Check if user has seen this popup before
    const seenKey = `hasSeenSaved${itemType}Popup`
    const hasSeen = localStorage.getItem(seenKey)
    setHasSeenPopup(!!hasSeen)
  }, [itemType])

  const handleClose = () => {
    // Mark as seen in localStorage so it doesn't show again
    const seenKey = `hasSeenSaved${itemType}Popup`
    localStorage.setItem(seenKey, 'true')
    onClose()
  }

  if (!isOpen || hasSeenPopup) {
    return null
  }

  const itemName = itemType === 'business' ? 'business' : 'market'
  const itemNameCapitalized = itemType === 'business' ? 'Business' : 'Market'

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden'>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500'
          aria-label='Close popup'
        >
          <FaTimes className='w-4 h-4 text-gray-600' />
        </button>

        {/* Header with Image */}
        <div className='relative h-48 bg-gradient-to-br from-green-100 to-blue-100'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='relative'>
              <Image
                src='/images/savedbizimage.png'
                alt='Saved item illustration'
                width={200}
                height={150}
                className='object-contain'
                priority
              />
            </div>
          </div>

          {/* Success Icon */}
          <div className='absolute top-4 left-4 bg-green-500 text-white rounded-full p-3 shadow-lg'>
            <FaHeart className='w-6 h-6' />
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {itemNameCapitalized} Saved! 🎉
          </h2>

          <p className='text-gray-700 mb-4 leading-relaxed'>
            Great! You've saved this {itemName} to your collection. You can now
            easily find it later.
          </p>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
            <div className='flex items-start gap-3'>
              <FaUser className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-semibold text-blue-900 mb-1'>
                  How to view your saved items:
                </h3>
                <ol className='text-sm text-blue-800 space-y-1'>
                  <li>
                    1. Click on your profile dropdown in the top navigation
                  </li>
                  <li>
                    2. Select "Saved {itemNameCapitalized}s" from the menu
                  </li>
                  <li>3. Browse all your saved {itemName}s in one place!</li>
                </ol>
              </div>
            </div>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={handleClose}
              className='flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              Got it!
            </button>
            <button
              onClick={() => {
                localStorage.setItem(`hasSeenSaved${itemType}Popup`, 'true')
                onClose()
              }}
              className='px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg'
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
