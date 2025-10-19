import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export async function POST() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Find all threads where the current user is a participant
    const threads = await MessageThread.find({
      participants: sessionUser.userId,
    })

    // Mark all unread messages as read for this user
    const result = await Message.updateMany(
      {
        thread: { $in: threads.map((t) => t._id) },
        sender: { $ne: sessionUser.userId }, // Not sent by current user
        read: false, // Currently unread
      },
      {
        $set: { read: true },
      }
    )

    return NextResponse.json({
      success: true,
      message: `Marked ${result.modifiedCount} messages as read`,
    })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
