import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Find all threads where the current user is a participant and not blocked
    const threads = await MessageThread.find({
      participants: sessionUser.userId,
      blockedBy: null, // Not blocked
    })

    let unreadCount = 0

    // Count unread messages in each thread
    for (const thread of threads) {
      const unreadMessages = await Message.countDocuments({
        thread: thread._id,
        sender: { $ne: sessionUser.userId }, // Not sent by current user
        read: false, // Unread
      })
      unreadCount += unreadMessages
    }

    return NextResponse.json({ success: true, unreadCount })
  } catch (error) {
    console.error('Error fetching unread message count:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
