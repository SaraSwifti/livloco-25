import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
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

    const { userId } = params

    await connectDB()

    const user = await User.findById(userId).select('full_name email')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}


