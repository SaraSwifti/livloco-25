import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import MessageThread from '@/models/MessageThread'
import LocoBiz from '@/models/LocoBiz'
import HostFMarket from '@/models/HostFMarket'
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

    const thread = await MessageThread.findOne({
      _id: threadId,
      participants: sessionUser.userId,
    }).populate('participants', 'full_name email')

    if (!thread) {
      return NextResponse.json(
        { success: false, error: 'Thread not found' },
        { status: 404 }
      )
    }

    const otherUser = thread.participants.find(
      (p) => p._id.toString() !== sessionUser.userId
    )

    // Get the posting name
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

    return NextResponse.json({
      success: true,
      thread: {
        _id: thread._id,
        participants: thread.participants,
        postingType: thread.postingType,
        postingId: thread.postingId,
        postingName: postingName,
        blockedBy: thread.blockedBy,
        lastMessageAt: thread.lastMessageAt,
      },
      otherUser,
    })
  } catch (error) {
    console.error('Error fetching thread:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
