import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find the user to get their business and market IDs
    const user = await User.findById(userId)
      .populate('locobiz')
      .populate('hostfmarket')
      .lean()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    let businessSavedCount = 0
    let marketSavedCount = 0

    // Count users who have saved this user's business
    if (user.locobiz) {
      businessSavedCount = await User.countDocuments({
        saved_businesses: user.locobiz._id,
      })
    }

    // Count users who have saved this user's market
    if (user.hostfmarket) {
      marketSavedCount = await User.countDocuments({
        saved_markets: user.hostfmarket._id,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        businessSavedCount,
        marketSavedCount,
        totalSavedCount: businessSavedCount + marketSavedCount,
      },
    })
  } catch (error) {
    console.error('Error fetching saved count:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
