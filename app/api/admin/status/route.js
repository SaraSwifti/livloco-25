import { NextResponse } from 'next/server'
import { checkAdminStatus } from '@/utils/adminMiddleware'

export async function GET() {
  try {
    const adminStatus = await checkAdminStatus()

    return NextResponse.json({
      success: true,
      ...adminStatus,
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

