'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'
import { revalidatePath } from 'next/cache'
import connectDB from '@/config/database'
import User from '@/models/User'
import HostFMarket from '@/models/HostFMarket'
import mongoose from 'mongoose'

/**
 * Toggle save/unsave for a market.
 * If user has already saved it, unsave it.
 * If user hasn't saved it, save it.
 *
 * @param {string} marketId - The ID of the market to save/unsave
 * @returns {object} - { success: boolean, hasSaved: boolean, error?: string }
 */
export async function toggleMarketSaveAction(marketId) {
  try {
    console.log('toggleMarketSaveAction called with marketId:', marketId)
    await connectDB()

    // Get the current user session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      console.log('No session found')
      return { success: false, error: 'You must be logged in to save' }
    }

    const userEmail = session.user.email
    console.log('User email:', userEmail)

    // Find the user
    const user = await User.findOne({ email: userEmail }).select('_id saved_markets')
    if (!user) {
      console.log('User not found')
      return { success: false, error: 'User not found' }
    }

    console.log('User found:', user._id, 'saved_markets:', user.saved_markets)

    // Verify the market exists
    const market = await HostFMarket.findById(marketId).select('_id')
    if (!market) {
      console.log('Market not found:', marketId)
      return { success: false, error: 'Market not found' }
    }

    // Initialize saved_markets array if it doesn't exist in memory
    const savedMarketsArray = user.saved_markets || []

    // Check if user has already saved this market
    const hasSaved = savedMarketsArray.some(
      (savedId) => savedId.toString() === marketId.toString()
    )

    console.log('hasSaved:', hasSaved)

    if (hasSaved) {
      // Remove from saved
      console.log('Removing market from saved')
      const result = await User.findByIdAndUpdate(
        user._id,
        { $pull: { saved_markets: marketId } },
        { new: true, strict: false }
      )
      console.log('Update result:', result ? 'Success' : 'Failed')
      console.log('Updated saved_markets:', result?.saved_markets)

      // Revalidate the saved page and market page
      revalidatePath('/businesses/saved')
      revalidatePath(`/hostfarmmarkets/${marketId}`)

      return {
        success: true,
        hasSaved: false
      }
    } else {
      // Add to saved
      console.log('Adding market to saved')

      // Use direct MongoDB collection access to bypass Mongoose strict mode
      const db = mongoose.connection.db
      const usersCollection = db.collection('users')

      // Check if the field exists, if not initialize it
      const userDoc = await usersCollection.findOne({ _id: user._id })

      if (!userDoc.saved_markets) {
        console.log('Field does not exist, initializing it')
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { saved_markets: [] } }
        )
      }

      // Now add the market ID
      const result = await usersCollection.updateOne(
        { _id: user._id },
        { $addToSet: { saved_markets: new mongoose.Types.ObjectId(marketId) } }
      )

      console.log('Update result - matched:', result.matchedCount, 'modified:', result.modifiedCount)

      // Fetch the updated user to verify
      const updatedUser = await usersCollection.findOne({ _id: user._id })
      console.log('Updated saved_markets:', updatedUser?.saved_markets)

      // Revalidate the saved page and market page
      revalidatePath('/businesses/saved')
      revalidatePath(`/hostfarmmarkets/${marketId}`)

      return {
        success: true,
        hasSaved: true
      }
    }
  } catch (error) {
    console.error('Error toggling market save:', error)
    return { success: false, error: 'Failed to toggle save' }
  }
}
