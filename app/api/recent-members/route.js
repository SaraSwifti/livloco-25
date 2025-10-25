import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import LocoBiz from '@/models/LocoBiz'
import HostFMarket from '@/models/HostFMarket'

export async function GET() {
  try {
    await connectDB()

    // Fetch latest users who have created businesses or markets
    const recentUsers = await User.find({
      $or: [{ locobiz: { $exists: true } }, { hostfmarket: { $exists: true } }],
    })
      .populate('locobiz')
      .populate('hostfmarket')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()

    // Transform the data to match the expected format
    const allMembers = recentUsers
      .map((user) => {
        const members = []

        if (user.locobiz && user.locobiz.locobiz_active) {
          members.push({
            ...user.locobiz,
            type: 'business',
            memberName: user.full_name || 'Unknown',
            memberEmail: user.email || '',
            memberCreatedAt: user.createdAt,
          })
        }

        if (user.hostfmarket && user.hostfmarket.hostfm_active) {
          members.push({
            ...user.hostfmarket,
            type: 'market',
            memberName: user.full_name || 'Unknown',
            memberEmail: user.email || '',
            memberCreatedAt: user.createdAt,
          })
        }

        return members
      })
      .flat()
      .sort((a, b) => new Date(b.memberCreatedAt) - new Date(a.memberCreatedAt))
      .slice(0, 30) // Ensure we only return 30 total

    return NextResponse.json({
      success: true,
      members: allMembers,
    })
  } catch (error) {
    console.error('Error fetching recent members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent members' },
      { status: 500 }
    )
  }
}
