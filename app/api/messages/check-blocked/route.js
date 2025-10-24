import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import BlockedUser from '@/models/BlockedUser'
import { getSessionUser } from '@/utils/getSessionUser'

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { postingType, postingId, recipientId } = await request.json()

    if (!postingType || !postingId || !recipientId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if current user has blocked the recipient
    const currentUserBlocked = await BlockedUser.findOne({
      blocker: sessionUser.userId,
      blocked: recipientId,
    })

    // Check if recipient has blocked the current user
    const recipientBlocked = await BlockedUser.findOne({
      blocker: recipientId,
      blocked: sessionUser.userId,
    })

    return NextResponse.json({
      success: true,
      isBlockedByCurrentUser: !!currentUserBlocked,
      isBlockedByRecipient: !!recipientBlocked,
    })
  } catch (error) {
    console.error('Error checking blocked state:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
