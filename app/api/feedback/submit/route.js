import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import Feedback from '@/models/Feedback'
import User from '@/models/User'
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

    const { title, body } = await request.json()

    if (!title || !body) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Fetch the current user to get their email and phone
    const currentUser = await User.findById(sessionUser.userId).select(
      'email mem_phone'
    )

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Create feedback entry
    const feedback = await Feedback.create({
      user: sessionUser.userId,
      userEmail: currentUser.email || '',
      userPhone: currentUser.mem_phone || '',
      title: title.trim(),
      body: body.trim(),
      status: 'pending',
    })

    return NextResponse.json({
      success: true,
      feedback: {
        _id: feedback._id,
        title: feedback.title,
        body: feedback.body,
      },
    })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
