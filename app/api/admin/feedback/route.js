import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import Feedback from '@/models/Feedback'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(sessionUser.userId).select('role')

    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const feedback = await Feedback.find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      feedback,
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(sessionUser.userId).select('role')

    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const feedbackId = searchParams.get('id')
    const body = await request.json()
    const { status } = body

    if (!feedbackId) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      )
    }

    if (!status || !['pending', 'resolved'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid status (pending or resolved) is required',
        },
        { status: 400 }
      )
    }

    // Update feedback status
    await Feedback.findByIdAndUpdate(feedbackId, {
      status: status,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findById(sessionUser.userId).select('role')

    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const feedbackId = searchParams.get('id')

    if (!feedbackId) {
      return NextResponse.json(
        { success: false, error: 'Feedback ID is required' },
        { status: 400 }
      )
    }

    // Mark feedback as deleted
    await Feedback.findByIdAndUpdate(feedbackId, {
      status: 'deleted',
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete feedback' },
      { status: 500 }
    )
  }
}
