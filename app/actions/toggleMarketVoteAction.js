'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'
import connectDB from '@/config/database'
import User from '@/models/User'
import HostFMarket from '@/models/HostFMarket'

/**
 * Toggle a vote for a farmers market.
 * If user has already voted, remove the vote.
 * If user hasn't voted, add the vote.
 *
 * @param {string} marketId - The ID of the market to vote for
 * @returns {object} - { success: boolean, hasVoted: boolean, voteCount: number, error?: string }
 */
export async function toggleMarketVoteAction(marketId) {
  try {
    await connectDB()

    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'You must be logged in to vote' }
    }

    const userEmail = session.user.email

    // Find the user
    const user = await User.findOne({ email: userEmail }).select('_id voted_markets')
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Find the market
    const market = await HostFMarket.findById(marketId).select('hostfm_votes')
    if (!market) {
      return { success: false, error: 'Market not found' }
    }

    // Check if user has already voted
    const hasVoted = market.hostfm_votes.some(
      (voterId) => voterId.toString() === user._id.toString()
    )

    if (hasVoted) {
      // Remove vote
      await HostFMarket.findByIdAndUpdate(marketId, {
        $pull: { hostfm_votes: user._id }
      })
      await User.findByIdAndUpdate(user._id, {
        $pull: { voted_markets: marketId }
      })

      return {
        success: true,
        hasVoted: false,
        voteCount: market.hostfm_votes.length - 1
      }
    } else {
      // Add vote
      await HostFMarket.findByIdAndUpdate(marketId, {
        $addToSet: { hostfm_votes: user._id }
      })
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { voted_markets: marketId }
      })

      return {
        success: true,
        hasVoted: true,
        voteCount: market.hostfm_votes.length + 1
      }
    }
  } catch (error) {
    console.error('Error toggling market vote:', error)
    return { success: false, error: 'Failed to toggle vote' }
  }
}
