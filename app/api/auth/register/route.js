import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password, username } = await request.json()

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and username are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters long',
        },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      // If user exists but has no password (OAuth user), allow them to set one
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUser.password = hashedPassword
        await existingUser.save()

        return NextResponse.json({
          success: true,
          message:
            'Password set successfully. You can now sign in with email and password.',
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'User already exists. Please sign in instead.',
          },
          { status: 409 }
        )
      }
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Username is already taken' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in.',
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}
