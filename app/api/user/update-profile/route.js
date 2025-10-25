import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

export async function PUT(request) {
  try {
    const sessionUser = await getSessionUser()
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { full_name /* , email_memmessage_notification */ } =
      await request.json() // TODO: Implement email notification feature later

    // Validate input
    if (typeof full_name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Full name must be a string' },
        { status: 400 }
      )
    }

    // TODO: Implement email notification feature later
    // if (typeof email_memmessage_notification !== 'boolean') {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'Email notification preference must be a boolean',
    //     },
    //     { status: 400 }
    //   )
    // }

    await connectDB()

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.userId,
      {
        full_name: full_name.trim(),
        // email_memmessage_notification, // TODO: Implement email notification feature later
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        full_name: updatedUser.full_name,
        // email_memmessage_notification: updatedUser.email_memmessage_notification, // TODO: Implement email notification feature later
      },
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
