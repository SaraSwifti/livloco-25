'use client'

import { useState, useEffect } from 'react'
import { FaBookmark } from 'react-icons/fa'
import { toggleBusinessSaveAction } from '@/app/actions/toggleBusinessSaveAction'
import { toggleMarketSaveAction } from '@/app/actions/toggleMarketSaveAction'
import SavedItemPopup from './SavedItemPopup'

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
  isLoggedIn = false,
}) => {
  const [hasSaved, setHasSaved] = useState(initialHasSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

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
        const wasNotSaved = !hasSaved
        setHasSaved(result.hasSaved)

        // Show popup only when saving for the first time (not unsaving)
        if (wasNotSaved && result.hasSaved) {
          setShowPopup(true)
        }
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
    <>
      <div className='flex items-center gap-2'>
        <button
          onClick={handleSaveToggle}
          disabled={isLoading || !isLoggedIn}
          className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all w-[200px] justify-center ${
            hasSaved
              ? 'bg-amber-700 text-white hover:bg-amber-800'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          } ${
            isLoading || !isLoggedIn
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          title={!isLoggedIn ? 'Log in to save' : hasSaved ? 'Unsave' : 'Save'}
        >
          <FaBookmark
            className={`text-2xl ${hasSaved ? 'text-white' : 'text-gray-600'}`}
          />
          {hasSaved ? (
            <span className='text-sm'>
              You have saved this {itemType}.
              <span className='block font-bold text-base mt-1'>
                Click to unsave
              </span>
            </span>
          ) : (
            <span className='text-sm'>Save</span>
          )}
        </button>
      </div>

      {/* Saved Item Popup */}
      <SavedItemPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        itemType={type}
      />
    </>
  )
}

export default SaveButton
