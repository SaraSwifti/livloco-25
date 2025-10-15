'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/authOptions'
import { revalidatePath } from 'next/cache'
import connectDB from '@/config/database'
import User from '@/models/User'
import LocoBiz from '@/models/LocoBiz'
import mongoose from 'mongoose'

/**
 * Toggle save/unsave for a business.
 * If user has already saved it, unsave it.
 * If user hasn't saved it, save it.
 *
 * @param {string} businessId - The ID of the business to save/unsave
 * @returns {object} - { success: boolean, hasSaved: boolean, error?: string }
 */
export async function toggleBusinessSaveAction(businessId) {
  try {
    console.log('toggleBusinessSaveAction called with businessId:', businessId)
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
    const user = await User.findOne({ email: userEmail }).select('_id saved_businesses')
    if (!user) {
      console.log('User not found')
      return { success: false, error: 'User not found' }
    }

    console.log('User found:', user._id, 'saved_businesses:', user.saved_businesses)

    // Verify the business exists
    const business = await LocoBiz.findById(businessId).select('_id')
    if (!business) {
      console.log('Business not found:', businessId)
      return { success: false, error: 'Business not found' }
    }

    // Initialize saved_businesses array if it doesn't exist in memory
    const savedBusinessesArray = user.saved_businesses || []

    // Check if user has already saved this business
    const hasSaved = savedBusinessesArray.some(
      (savedId) => savedId.toString() === businessId.toString()
    )

    console.log('hasSaved:', hasSaved)

    if (hasSaved) {
      // Remove from saved
      console.log('Removing business from saved')
      const result = await User.findByIdAndUpdate(
        user._id,
        { $pull: { saved_businesses: businessId } },
        { new: true, strict: false }
      )
      console.log('Update result:', result ? 'Success' : 'Failed')
      console.log('Updated saved_businesses:', result?.saved_businesses)

      // Revalidate the saved page and business page
      revalidatePath('/businesses/saved')
      revalidatePath(`/businesses/${businessId}`)

      return {
        success: true,
        hasSaved: false
      }
    } else {
      // Add to saved
      console.log('Adding business to saved')

      // Use direct MongoDB collection access to bypass Mongoose strict mode
      const db = mongoose.connection.db
      const usersCollection = db.collection('users')

      // Check if the field exists, if not initialize it
      const userDoc = await usersCollection.findOne({ _id: user._id })

      if (!userDoc.saved_businesses) {
        console.log('Field does not exist, initializing it')
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { saved_businesses: [] } }
        )
      }

      // Now add the business ID
      const result = await usersCollection.updateOne(
        { _id: user._id },
        { $addToSet: { saved_businesses: new mongoose.Types.ObjectId(businessId) } }
      )

      console.log('Update result - matched:', result.matchedCount, 'modified:', result.modifiedCount)

      // Fetch the updated user to verify
      const updatedUser = await usersCollection.findOne({ _id: user._id })
      console.log('Updated saved_businesses:', updatedUser?.saved_businesses)

      // Revalidate the saved page and business page
      revalidatePath('/businesses/saved')
      revalidatePath(`/businesses/${businessId}`)

      return {
        success: true,
        hasSaved: true
      }
    }
  } catch (error) {
    console.error('Error toggling business save:', error)
    return { success: false, error: 'Failed to toggle save' }
  }
}
