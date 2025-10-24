import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
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

    const { threadId, content } = await request.json()

    if (!threadId || !content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (content.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Message too long (max 100 characters)' },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify user has access to this thread and it's not blocked
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

    if (thread.blockedBy) {
      return NextResponse.json(
        { success: false, error: 'This conversation is blocked' },
        { status: 403 }
      )
    }

    // Create new message
    const message = new Message({
      thread: threadId,
      sender: sessionUser.userId,
      content: content.trim(),
    })

    await message.save()

    // Update thread with last message info
    await MessageThread.findByIdAndUpdate(threadId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: {
        _id: message._id,
        content: message.content,
        sender: sessionUser.userId,
        createdAt: message.createdAt,
      },
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
