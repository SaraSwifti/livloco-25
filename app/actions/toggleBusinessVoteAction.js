'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'
import connectDB from '@/config/database'
import User from '@/models/User'
import LocoBiz from '@/models/LocoBiz'

/**
 * Toggle a vote for a business.
 * If user has already voted, remove the vote.
 * If user hasn't voted, add the vote.
 *
 * @param {string} businessId - The ID of the business to vote for
 * @returns {object} - { success: boolean, hasVoted: boolean, voteCount: number, error?: string }
 */
export async function toggleBusinessVoteAction(businessId) {
  try {
    await connectDB()

    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'You must be logged in to vote' }
    }

    const userEmail = session.user.email

    // Find the user
    const user = await User.findOne({ email: userEmail }).select('_id voted_businesses')
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Find the business
    const business = await LocoBiz.findById(businessId).select('locobiz_votes')
    if (!business) {
      return { success: false, error: 'Business not found' }
    }

    // Check if user has already voted
    const hasVoted = business.locobiz_votes.some(
      (voterId) => voterId.toString() === user._id.toString()
    )

    if (hasVoted) {
      // Remove vote
      await LocoBiz.findByIdAndUpdate(businessId, {
        $pull: { locobiz_votes: user._id }
      })
      await User.findByIdAndUpdate(user._id, {
        $pull: { voted_businesses: businessId }
      })

      return {
        success: true,
        hasVoted: false,
        voteCount: business.locobiz_votes.length - 1
      }
    } else {
      // Add vote
      await LocoBiz.findByIdAndUpdate(businessId, {
        $addToSet: { locobiz_votes: user._id }
      })
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { voted_businesses: businessId }
      })

      return {
        success: true,
        hasVoted: true,
        voteCount: business.locobiz_votes.length + 1
      }
    }
  } catch (error) {
    console.error('Error toggling business vote:', error)
    return { success: false, error: 'Failed to toggle vote' }
  }
}
