import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import User from '@/models/User'

export async function POST(req) {
  try {
    const { email, profile_choice } = await req.json()
    if (!email || !profile_choice) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    await connectDB()
    await User.updateOne({ email }, { $set: { profile_choice } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('update-profile-choice error:', err)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
