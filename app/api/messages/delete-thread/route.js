import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export async function DELETE(request) {
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

    // Delete all messages in the thread
    await Message.deleteMany({ thread: threadId })

    // Delete the thread itself
    await MessageThread.findByIdAndDelete(threadId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting thread:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
