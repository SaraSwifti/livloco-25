// File: app/api/update-profile-choice/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth/authOptions'
import connectDB from '@/config/database'
import User from '@/models/User'
import mongoose from 'mongoose'

const ALLOWED = new Set(['none', 'locobiz', 'hostfmarket'])

// Minimal change-log model (avoids recompilation in dev)
const ProfileChoiceLog =
  mongoose.models.ProfileChoiceLog ||
  mongoose.model(
    'ProfileChoiceLog',
    new mongoose.Schema(
      {
        email: { type: String, index: true },
        from: String,
        to: { type: String, enum: ['none', 'locobiz', 'hostfmarket'] },
        at: { type: Date, default: Date.now },
        ip: String,
        userAgent: String
      },
      { collection: 'profile_choice_logs' }
    )
  )

export async function POST(req) {
  try {
    // 1) Auth guard
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    // 2) Parse + validate body
    let payload
    try {
      payload = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    let { email, profile_choice } = payload || {}
    if (typeof email !== 'string' || typeof profile_choice !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 })
    }

    email = email.trim().toLowerCase()
    profile_choice = profile_choice.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 })
    }
    if (!ALLOWED.has(profile_choice)) {
      return NextResponse.json({ ok: false, error: "profile_choice must be one of: 'none', 'locobiz', 'hostfmarket'" }, { status: 400 })
    }

    // 3) Session-based authorization: self OR admin
    const sessionEmail = String(session.user.email).toLowerCase()
    const isAdmin = session.user?.role === 'admin' || session.user?.isAdmin === true
    if (sessionEmail !== email && !isAdmin) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    // 4) DB work
    await connectDB()

    // Fetch existing to get "from" value for logging
    const user = await User.findOne({ email }).lean()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }
    const prevChoice = (user.profile_choice || 'none').toLowerCase()

    // Idempotent short-circuit (still log to show attempted set)
    const result = await User.updateOne(
      { email },
      { $set: { profile_choice } },
      { upsert: false }
    )

    // 5) Logging (best-effort; do not fail request if logging fails)
    try {
      const ua = req.headers.get('user-agent') || ''
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        ''
      await ProfileChoiceLog.create({
        email,
        from: prevChoice,
        to: profile_choice,
        ip,
        userAgent: ua
      })
    } catch (e) {
      console.warn('ProfileChoiceLog failed:', e?.message || e)
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, profile_choice })
  } catch (err) {
    console.error('update-profile-choice error:', err)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed' }, { status: 405 })
}
