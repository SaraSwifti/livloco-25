import { NextResponse } from 'next/server'
import { getSessionUser } from '@/utils/getSessionUser'
import connectDB from '@/config/database'
import User from '@/models/User'

export async function requireAdmin(request) {
  try {
    const sessionUser = await getSessionUser()
    
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(sessionUser.userId).select('role permissions')
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (!['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    return {
      success: true,
      user: {
        id: user._id,
        role: user.role,
        permissions: user.permissions,
      }
    }
  } catch (error) {
    console.error('Admin middleware error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function requireSuperAdmin(request) {
  try {
    const sessionUser = await getSessionUser()
    
    if (!sessionUser?.userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(sessionUser.userId).select('role permissions')
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Super admin access required' },
        { status: 403 }
      )
    }

    return {
      success: true,
      user: {
        id: user._id,
        role: user.role,
        permissions: user.permissions,
      }
    }
  } catch (error) {
    console.error('Super admin middleware error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function checkAdminStatus() {
  try {
    const sessionUser = await getSessionUser()
    
    if (!sessionUser?.userId) {
      return { isAdmin: false, isSuperAdmin: false }
    }

    await connectDB()

    const user = await User.findById(sessionUser.userId).select('role permissions')
    
    if (!user) {
      return { isAdmin: false, isSuperAdmin: false }
    }

    return {
      isAdmin: ['admin', 'super_admin'].includes(user.role),
      isSuperAdmin: user.role === 'super_admin',
      role: user.role,
      permissions: user.permissions,
    }
  } catch (error) {
    console.error('Admin status check error:', error)
    return { isAdmin: false, isSuperAdmin: false }
  }
}


