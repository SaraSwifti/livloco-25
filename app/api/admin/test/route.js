import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET() {
  try {
    console.log('Test endpoint called')

    const sessionUser = await getSessionUser()
    console.log('Session user:', sessionUser)

    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()
    console.log('Database connected')

    const user = await User.findById(sessionUser.userId)
    console.log('User found:', user ? 'Yes' : 'No')

    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      sessionUser: {
        userId: sessionUser.userId,
        email: sessionUser.email,
      },
      user: user
        ? {
            id: user._id,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
          }
        : null,
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}


