import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET(request, { params }) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { threadId } = params

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

    const messages = await Message.find({ thread: threadId })
      .populate('sender', 'full_name')
      .sort({ createdAt: 1 })

    return NextResponse.json({
      success: true,
      messages: messages.map((message) => ({
        _id: message._id,
        content: message.content,
        sender: message.sender,
        read: message.read,
        createdAt: message.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
