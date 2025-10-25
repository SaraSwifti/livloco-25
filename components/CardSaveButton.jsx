'use client'

import { useState } from 'react'
import { FaBookmark } from 'react-icons/fa'
import { toggleBusinessSaveAction } from '@/app/actions/toggleBusinessSaveAction'
import { toggleMarketSaveAction } from '@/app/actions/toggleMarketSaveAction'
import SavedItemPopup from '@/components/SavedItemPopup'

const CardSaveButton = ({
  id,
  type,
  isLoggedIn = false,
  initialHasSaved = false,
  className = '',
}) => {
  const [hasSaved, setHasSaved] = useState(initialHasSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleSaveToggle = async (e) => {
    e.preventDefault() // Prevent card click
    e.stopPropagation() // Stop event bubbling

    if (!isLoggedIn) {
      // Could show a login prompt here
      return
    }

    setIsLoading(true)

    try {
      const wasNotSaved = !hasSaved

      let result
      if (type === 'business') {
        result = await toggleBusinessSaveAction(id)
      } else if (type === 'market') {
        result = await toggleMarketSaveAction(id)
      }

      if (result?.success) {
        setHasSaved(result.hasSaved)

        // Show popup only when saving for the first time
        if (wasNotSaved && result.hasSaved) {
          setShowPopup(true)
        }
      }
    } catch (error) {
      console.error('Failed to toggle save:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null // Don't show save button for non-logged-in users
  }

  return (
    <>
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`
           absolute top-3 left-3 z-10 
           w-8 h-8 rounded-full 
           flex items-center justify-center
           transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2
           border border-white
           ${
             hasSaved
               ? 'bg-yellow-600 text-sky-700 hover:bg-yellow-700 focus:ring-yellow-500'
               : 'bg-gray-500/80 text-gray-300 hover:bg-gray-600/80 focus:ring-gray-400'
           }
           ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
           ${className}
         `}
        aria-label={hasSaved ? `Unsave this ${type}` : `Save this ${type}`}
        title={hasSaved ? `Unsave this ${type}` : `Save this ${type}`}
      >
        <FaBookmark className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
      </button>

      {/* Saved Item Popup */}
      <SavedItemPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        itemType={type}
      />
    </>
  )
}

export default CardSaveButton
