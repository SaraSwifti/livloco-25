import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET() {
  try {
    const sessionUser = await getSessionUser()

    if (!sessionUser?.userId) {
      return NextResponse.json({
        success: false,
        isAdmin: false,
      })
    }

    await connectDB()

    const user = await User.findById(sessionUser.userId).select('role')

    if (!user) {
      return NextResponse.json({
        success: false,
        isAdmin: false,
      })
    }

    const isAdmin = ['admin', 'super_admin'].includes(user.role)

    return NextResponse.json({
      success: true,
      isAdmin,
      role: user.role,
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      {
        success: false,
        isAdmin: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
