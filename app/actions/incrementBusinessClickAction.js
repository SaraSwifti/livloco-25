'use server'

import connectDB from '@/config/database'
import LocoBiz from '@/models/LocoBiz'

/**
 * Increment the card click count for a business.
 * No authentication required - tracks all clicks regardless of user.
 *
 * @param {string} businessId - The ID of the business
 * @returns {object} - { success: boolean, clickCount?: number, error?: string }
 */
export async function incrementBusinessClickAction(businessId) {
  try {
    await connectDB()

    // Increment the card_clicks field by 1
    const business = await LocoBiz.findByIdAndUpdate(
      businessId,
      { $inc: { card_clicks: 1 } },
      { new: true, select: 'card_clicks' }
    )

    if (!business) {
      return { success: false, error: 'Business not found' }
    }

    return {
      success: true,
      clickCount: business.card_clicks
    }
  } catch (error) {
    console.error('Error incrementing business click:', error)
    return { success: false, error: 'Failed to increment click count' }
  }
}
