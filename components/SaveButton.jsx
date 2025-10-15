'use client'

import { useState, useEffect } from 'react'
import { FaBookmark } from 'react-icons/fa'
import { toggleBusinessSaveAction } from '@/app/actions/toggleBusinessSaveAction'
import { toggleMarketSaveAction } from '@/app/actions/toggleMarketSaveAction'

/**
 * SaveButton component with bookmark icon
 *
 * @param {string} id - The ID of the business or market
 * @param {string} type - Either 'business' or 'market'
 * @param {boolean} initialHasSaved - Whether the current user has already saved this item
 * @param {boolean} isLoggedIn - Whether the user is logged in
 */
const SaveButton = ({
  id,
  type,
  initialHasSaved = false,
  isLoggedIn = false
}) => {
  const [hasSaved, setHasSaved] = useState(initialHasSaved)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setHasSaved(initialHasSaved)
  }, [initialHasSaved])

  const handleSaveToggle = async () => {
    if (!isLoggedIn) {
      alert('Please log in to save')
      return
    }

    setIsLoading(true)

    try {
      let result
      if (type === 'business') {
        result = await toggleBusinessSaveAction(id)
      } else if (type === 'market') {
        result = await toggleMarketSaveAction(id)
      } else {
        console.error('Invalid type provided to SaveButton')
        return
      }

      if (result.success) {
        setHasSaved(result.hasSaved)
      } else {
        alert(result.error || 'Failed to toggle save')
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      alert('An error occurred while toggling save')
    } finally {
      setIsLoading(false)
    }
  }

  // Determine the display text based on type
  const itemType = type === 'business' ? 'LocoBusiness' : 'LocoMarket'

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handleSaveToggle}
        disabled={isLoading || !isLoggedIn}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          hasSaved
            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        } ${
          isLoading || !isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title={!isLoggedIn ? 'Log in to save' : hasSaved ? 'Unsave' : 'Save'}
      >
        <FaBookmark className={`text-lg ${hasSaved ? 'text-white' : 'text-gray-600'}`} />
        {hasSaved ? (
          <span className='text-sm'>You have saved this {itemType}</span>
        ) : (
          <span className='text-sm'>Save</span>
        )}
      </button>
    </div>
  )
}

export default SaveButton
