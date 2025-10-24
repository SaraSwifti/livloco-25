import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import ThreadDeletionNotification from '@/models/ThreadDeletionNotification'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET() {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch unread deletion notifications for the current user
    const notifications = await ThreadDeletionNotification.find({
      recipient: sessionUser.userId,
      isRead: false,
    })
      .populate('deletedBy', 'full_name')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      notifications: notifications.map((notification) => ({
        _id: notification._id,
        deletedBy: notification.deletedBy,
        threadInfo: notification.threadInfo,
        createdAt: notification.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching deletion notifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { notificationId } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Missing notification ID' },
        { status: 400 }
      )
    }

    await connectDB()

    // Mark notification as read
    const notification = await ThreadDeletionNotification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: sessionUser.userId,
      },
      { isRead: true },
      { new: true }
    )

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

