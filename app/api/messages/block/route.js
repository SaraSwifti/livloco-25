import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
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

    const { threadId } = await request.json()

    if (!threadId) {
      return NextResponse.json(
        { success: false, error: 'Missing thread ID' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify user has access to this thread
    const thread = await MessageThread.findOne({
      _id: threadId,
      participants: sessionUser.userId,
    })

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    // Block the conversation
    await MessageThread.findByIdAndUpdate(threadId, {
      blockedBy: sessionUser.userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error blocking user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
