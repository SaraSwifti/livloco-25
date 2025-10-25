// app/api/me/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'
import { getSessionUser } from '@/utils/getSessionUser'

export async function GET() {
  const sess = await getSessionUser()
  if (!sess?.userEmail) return NextResponse.json({ user: null })

  await connectDB()

  let user = null
  try {
    user = await User.findOne({ email: sess.userEmail })
      .select(
        '_id full_name phone /* email_memmessage_notification */ profile_choice locobiz hostfmarket'
      ) // TODO: Implement email notification feature later
      .lean()
  } catch (error) {
    console.log('Error fetching user:', error)
  }

  return NextResponse.json({ user })
}
