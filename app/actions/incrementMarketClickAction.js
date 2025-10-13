'use server'

import connectDB from '@/config/database'
import HostFMarket from '@/models/HostFMarket'

/**
 * Increment the card click count for a farmers market.
 * No authentication required - tracks all clicks regardless of user.
 *
 * @param {string} marketId - The ID of the market
 * @returns {object} - { success: boolean, clickCount?: number, error?: string }
 */
export async function incrementMarketClickAction(marketId) {
  try {
    await connectDB()

    // Increment the card_clicks field by 1
    const market = await HostFMarket.findByIdAndUpdate(
      marketId,
      { $inc: { card_clicks: 1 } },
      { new: true, select: 'card_clicks' }
    )

    if (!market) {
      return { success: false, error: 'Market not found' }
    }

    return {
      success: true,
      clickCount: market.card_clicks
    }
  } catch (error) {
    console.error('Error incrementing market click:', error)
    return { success: false, error: 'Failed to increment click count' }
  }
}
