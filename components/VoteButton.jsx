'use client'

import { useState, useEffect } from 'react'
import { FaThumbsUp } from 'react-icons/fa'
import { toggleBusinessVoteAction } from '@/app/actions/toggleBusinessVoteAction'
import { toggleMarketVoteAction } from '@/app/actions/toggleMarketVoteAction'

/**
 * VoteButton component with thumbs up icon and vote count
 *
 * @param {string} id - The ID of the business or market
 * @param {string} type - Either 'business' or 'market'
 * @param {number} initialVoteCount - Initial vote count
 * @param {boolean} initialHasVoted - Whether the current user has already voted
 * @param {boolean} isLoggedIn - Whether the user is logged in
 */
const VoteButton = ({
  id,
  type,
  initialVoteCount = 0,
  initialHasVoted = false,
  isLoggedIn = false,
}) => {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [hasVoted, setHasVoted] = useState(initialHasVoted)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setVoteCount(initialVoteCount)
    setHasVoted(initialHasVoted)
  }, [initialVoteCount, initialHasVoted])

  const handleVoteToggle = async () => {
    if (!isLoggedIn) {
      alert('Please log in to vote')
      return
    }

    setIsLoading(true)

    try {
      let result
      if (type === 'business') {
        result = await toggleBusinessVoteAction(id)
      } else if (type === 'market') {
        result = await toggleMarketVoteAction(id)
      } else {
        console.error('Invalid type provided to VoteButton')
        return
      }

      if (result.success) {
        setHasVoted(result.hasVoted)
        setVoteCount(result.voteCount)
      } else {
        alert(result.error || 'Failed to toggle vote')
      }
    } catch (error) {
      console.error('Error toggling vote:', error)
      alert('An error occurred while toggling vote')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handleVoteToggle}
        disabled={isLoading || !isLoggedIn}
        className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all w-[200px] justify-center ${
          hasVoted
            ? 'bg-sky-600 text-white hover:bg-sky-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } ${
          isLoading || !isLoggedIn
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
        title={
          !isLoggedIn ? 'Log in to vote' : hasVoted ? 'Remove vote' : 'Vote'
        }
      >
        <FaThumbsUp
          className={`text-2xl ${hasVoted ? 'text-white' : 'text-gray-600'}`}
        />
        {hasVoted ? (
          <span className='text-sm'>
            You have voted for this business.
            <span className='block font-bold text-base mt-1'>
              Click to unvote
            </span>
          </span>
        ) : (
          <span className='text-sm'>Vote</span>
        )}
      </button>
    </div>
  )
}

export default VoteButton
