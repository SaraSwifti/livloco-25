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

    // Find all threads where the current user has blocked someone
    const blockedThreads = await MessageThread.find({
      participants: sessionUser.userId,
      blockedBy: sessionUser.userId,
    })
      .populate('participants', 'full_name email')
      .sort({ updatedAt: -1 })

    // Extract the blocked users (the other participants)
    const blockedUsers = blockedThreads.map((thread) => {
      const blockedUser = thread.participants.find(
        (p) => p._id.toString() !== sessionUser.userId
      )
      return {
        threadId: thread._id,
        userId: blockedUser._id,
        fullName: blockedUser.full_name,
        email: blockedUser.email,
        postingType: thread.postingType,
        postingId: thread.postingId,
        blockedAt: thread.updatedAt,
      }
    })

    return NextResponse.json({
      success: true,
      blockedUsers,
    })
  } catch (error) {
    console.error('Error fetching blocked users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
