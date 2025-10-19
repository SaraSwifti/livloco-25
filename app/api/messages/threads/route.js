import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
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

    const threads = await MessageThread.find({
      participants: sessionUser.userId,
      blockedBy: null, // Exclude blocked threads from messages tab
    })
      .populate('participants', 'full_name email')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })

    return NextResponse.json({
      success: true,
      threads: threads.map((thread) => ({
        _id: thread._id,
        participants: thread.participants,
        postingType: thread.postingType,
        postingId: thread.postingId,
        blockedBy: thread.blockedBy,
        lastMessage: thread.lastMessage,
        lastMessageAt: thread.lastMessageAt,
        autoDeleteAt: thread.autoDeleteAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
