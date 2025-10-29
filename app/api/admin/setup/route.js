import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
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

    const { adminEmail, secretKey } = await request.json()

    // Simple security check - you can change this secret key
    if (secretKey !== 'livloco-admin-2024') {
      return NextResponse.json(
        { success: false, error: 'Invalid secret key' },
        { status: 403 }
      )
    }

    await connectDB()

    // Find the user by email
    const user = await User.findOne({ email: adminEmail })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found with that email' },
        { status: 404 }
      )
    }

    // Promote to super admin
    await User.findByIdAndUpdate(user._id, {
      role: 'super_admin',
      permissions: [
        'coupon_management',
        'user_management',
        'report_management',
      ],
    })

    return NextResponse.json({
      success: true,
      message: `User ${adminEmail} has been promoted to super admin`,
      user: {
        email: user.email,
        full_name: user.full_name,
        role: 'super_admin',
      },
    })
  } catch (error) {
    console.error('Error promoting user to admin:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}


