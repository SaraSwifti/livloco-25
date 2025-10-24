import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import LocoBiz from '@/models/LocoBiz'
import HostFMarket from '@/models/HostFMarket'
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

    const { postingType, postingId, recipientId, content } =
      await request.json()

    if (
      !postingType ||
      !postingId ||
      !recipientId ||
      !content ||
      content.trim().length === 0
    ) {
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

    // Verify the posting exists and get owner info
    let posting, postingOwner
    if (postingType === 'business') {
      posting = await LocoBiz.findById(postingId).populate('owner')
      postingOwner = posting?.owner
    } else if (postingType === 'hostfarmmarket') {
      posting = await HostFMarket.findById(postingId).populate('owner')
      postingOwner = posting?.owner
    }

    if (!posting || !postingOwner) {
      return NextResponse.json(
        { success: false, error: 'Posting not found' },
        { status: 404 }
      )
    }

    // Check if user is trying to message themselves
    if (sessionUser.userId === recipientId) {
      return NextResponse.json(
        { success: false, error: 'Cannot message yourself' },
        { status: 400 }
      )
    }

    // Check if user is trying to message the posting owner
    if (sessionUser.userId === postingOwner._id.toString()) {
      return NextResponse.json(
        { success: false, error: 'Cannot message yourself' },
        { status: 400 }
      )
    }

    // Check if sender has 20 or more message threads
    const senderThreadCount = await MessageThread.countDocuments({
      participants: sessionUser.userId,
    })

    if (senderThreadCount >= 20) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Your messaging box is full. Please delete unnecessary messages.',
        },
        { status: 400 }
      )
    }

    // Check if recipient has 20 or more message threads
    const recipientThreadCount = await MessageThread.countDocuments({
      participants: recipientId,
    })

    if (recipientThreadCount >= 20) {
      return NextResponse.json(
        { success: false, error: "This member's message box is full" },
        { status: 400 }
      )
    }

    // Check if a thread already exists between these two users
    let thread = await MessageThread.findOne({
      participants: { $all: [sessionUser.userId, recipientId] },
    })

    // If no thread exists, create one
    if (!thread) {
      thread = new MessageThread({
        participants: [sessionUser.userId, recipientId],
        initiator: sessionUser.userId,
        recipient: recipientId,
        postingType,
        postingId,
      })

      await thread.save()
    }

    // Create the message
    const message = new Message({
      thread: thread._id,
      sender: sessionUser.userId,
      content: content.trim(),
    })

    await message.save()

    // Update thread with last message info
    await MessageThread.findByIdAndUpdate(thread._id, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      threadId: thread._id.toString(),
      message: {
        _id: message._id,
        content: message.content,
        sender: sessionUser.userId,
        createdAt: message.createdAt,
      },
    })
  } catch (error) {
    console.error('Error sending new message:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

