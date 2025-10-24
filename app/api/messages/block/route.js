import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import Message from '@/models/Message'
import ThreadDeletionNotification from '@/models/ThreadDeletionNotification'
import BlockedUser from '@/models/BlockedUser'
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
    }).populate('participants', 'full_name')

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    // Find the other participant (the one being blocked)
    const otherParticipant = thread.participants.find(
      (p) => p._id.toString() !== sessionUser.userId
    )

    // Get posting information for the notification
    let postingName = 'Unknown'
    try {
      if (thread.postingType === 'business') {
        const business = await LocoBiz.findById(thread.postingId)
          .select('locobiz_name')
          .lean()
        postingName = business?.locobiz_name || 'Unknown Business'
      } else if (thread.postingType === 'hostfarmmarket') {
        const market = await HostFMarket.findById(thread.postingId)
          .select('hostfm_name')
          .lean()
        postingName = market?.hostfm_name || 'Unknown Market'
      }
    } catch (error) {
      console.error('Error fetching posting name:', error)
    }

    // Create notification for the other participant about the blocking/deletion
    if (otherParticipant) {
      const notification = new ThreadDeletionNotification({
        recipient: otherParticipant._id,
        deletedBy: sessionUser.userId,
        threadInfo: {
          postingType: thread.postingType,
          postingId: thread.postingId,
          postingName: postingName,
        },
      })
      await notification.save()

      // Create blocked user record
      await BlockedUser.findOneAndUpdate(
        { blocker: sessionUser.userId, blocked: otherParticipant._id },
        {
          blocker: sessionUser.userId,
          blocked: otherParticipant._id,
          originalThreadInfo: {
            postingType: thread.postingType,
            postingId: thread.postingId,
            postingName: postingName,
          },
        },
        { upsert: true, new: true }
      )
    }

    // Delete all messages in the thread
    await Message.deleteMany({ thread: threadId })

    // Delete the thread itself (complete deletion, not just blocking)
    await MessageThread.findByIdAndDelete(threadId)

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
