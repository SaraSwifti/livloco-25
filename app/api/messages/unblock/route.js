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

    // Verify user has access to this thread and is the one who blocked it
    const thread = await MessageThread.findOne({
      _id: threadId,
      participants: sessionUser.userId,
      blockedBy: sessionUser.userId,
    })

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found or not blocked by you' },
        { status: 404 }
      )
    }

    // Unblock the conversation
    await MessageThread.findByIdAndUpdate(threadId, {
      blockedBy: null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unblocking user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
