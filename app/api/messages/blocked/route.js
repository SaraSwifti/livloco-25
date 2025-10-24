import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import BlockedUser from '@/models/BlockedUser'
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

    // Find all users blocked by the current user
    const blockedUsers = await BlockedUser.find({
      blocker: sessionUser.userId,
    })
      .populate('blocked', 'full_name email')
      .sort({ createdAt: -1 })

    // Format the response
    const formattedBlockedUsers = blockedUsers.map((blockedUser) => ({
      userId: blockedUser.blocked._id,
      fullName: blockedUser.blocked.full_name,
      email: blockedUser.blocked.email,
      postingType: blockedUser.originalThreadInfo.postingType,
      postingId: blockedUser.originalThreadInfo.postingId,
      postingName: blockedUser.originalThreadInfo.postingName,
      blockedAt: blockedUser.createdAt,
    }))

    return NextResponse.json({
      success: true,
      blockedUsers: formattedBlockedUsers,
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
