// utils/messageLimits.js
// Utility functions for message thread limits

import MessageThread from '@/models/MessageThread'

/**
 * Check if a user has reached the maximum number of message threads (20)
 * @param {string} userId - The user ID to check
 * @returns {Promise<{isAtLimit: boolean, count: number}>}
 */
export async function checkUserThreadLimit(userId) {
  const count = await MessageThread.countDocuments({
    participants: userId,
  })

  return {
    isAtLimit: count >= 20,
    count,
  }
}

/**
 * Get the number of message threads for a user
 * @param {string} userId - The user ID to check
 * @returns {Promise<number>}
 */
export async function getUserThreadCount(userId) {
  return await MessageThread.countDocuments({
    participants: userId,
  })
}

/**
 * Check if both users can participate in a new message thread
 * @param {string} senderId - The sender's user ID
 * @param {string} recipientId - The recipient's user ID
 * @returns {Promise<{canCreate: boolean, senderAtLimit: boolean, recipientAtLimit: boolean, error?: string}>}
 */
export async function canCreateNewThread(senderId, recipientId) {
  const [senderCount, recipientCount] = await Promise.all([
    getUserThreadCount(senderId),
    getUserThreadCount(recipientId),
  ])

  const senderAtLimit = senderCount >= 20
  const recipientAtLimit = recipientCount >= 20

  if (senderAtLimit) {
    return {
      canCreate: false,
      senderAtLimit: true,
      recipientAtLimit,
      error: 'Your messaging box is full. Please delete unnecessary messages.',
    }
  }

  if (recipientAtLimit) {
    return {
      canCreate: false,
      senderAtLimit: false,
      recipientAtLimit: true,
      error: "This member's message box is full",
    }
  }

  return {
    canCreate: true,
    senderAtLimit: false,
    recipientAtLimit: false,
  }
}
