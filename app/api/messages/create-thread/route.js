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

    const { postingType, postingId, recipientId } = await request.json()

    if (!postingType || !postingId || !recipientId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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

    // Check if a thread already exists between these two users (regardless of posting)
    const existingThread = await MessageThread.findOne({
      participants: { $all: [sessionUser.userId, recipientId] },
    })

    if (existingThread) {
      return NextResponse.json({
        success: true,
        threadId: existingThread._id.toString(),
        existing: true,
      })
    }

    // Create new thread
    const thread = new MessageThread({
      participants: [sessionUser.userId, recipientId],
      initiator: sessionUser.userId,
      recipient: recipientId,
      postingType,
      postingId,
    })

    await thread.save()

    return NextResponse.json({
      success: true,
      threadId: thread._id.toString(),
      existing: false,
    })
  } catch (error) {
    console.error('Error creating message thread:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
