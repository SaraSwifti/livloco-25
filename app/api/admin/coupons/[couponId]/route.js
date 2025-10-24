import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import Coupon from '@/models/Coupon'
import { requireAdmin } from '@/utils/adminMiddleware'

export async function GET(request, { params }) {
  try {
    const adminCheck = await requireAdmin()
    if (!adminCheck.success) {
      return adminCheck
    }

    const { couponId } = params

    await connectDB()

    const coupon = await Coupon.findById(couponId)
      .populate('createdBy', 'full_name email')
      .populate('lastModifiedBy', 'full_name email')

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        zipcodeRestriction: coupon.zipcodeRestriction,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usageCount,
        usageLimitPerUser: coupon.usageLimitPerUser,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        isActive: coupon.isActive,
        isPublic: coupon.isPublic,
        applicableTo: coupon.applicableTo,
        specificItems: coupon.specificItems,
        specificItemsType: coupon.specificItemsType,
        createdBy: coupon.createdBy,
        lastModifiedBy: coupon.lastModifiedBy,
        totalDiscountGiven: coupon.totalDiscountGiven,
        totalOrders: coupon.totalOrders,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt,
        isValid: coupon.isValid,
        remainingUses: coupon.remainingUses,
      },
    })
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const adminCheck = await requireAdmin()
    if (!adminCheck.success) {
      return adminCheck
    }

    const { couponId } = params
    const updateData = await request.json()

    await connectDB()

    const coupon = await Coupon.findById(couponId)

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      )
    }

    // Validation
    if (
      updateData.discountType === 'percentage' &&
      updateData.discountValue > 100
    ) {
      return NextResponse.json(
        { success: false, error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      )
    }

    if (
      updateData.validFrom &&
      updateData.validUntil &&
      new Date(updateData.validFrom) >= new Date(updateData.validUntil)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid until date must be after valid from date',
        },
        { status: 400 }
      )
    }

    // Update coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        ...updateData,
        lastModifiedBy: adminCheck.user.id,
        // Ensure code is uppercase if being updated
        ...(updateData.code && { code: updateData.code.toUpperCase() }),
        // Convert dates if provided
        ...(updateData.validFrom && {
          validFrom: new Date(updateData.validFrom),
        }),
        ...(updateData.validUntil && {
          validUntil: new Date(updateData.validUntil),
        }),
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'full_name email')
      .populate('lastModifiedBy', 'full_name email')

    return NextResponse.json({
      success: true,
      coupon: {
        _id: updatedCoupon._id,
        code: updatedCoupon.code,
        name: updatedCoupon.name,
        description: updatedCoupon.description,
        discountType: updatedCoupon.discountType,
        discountValue: updatedCoupon.discountValue,
        zipcodeRestriction: updatedCoupon.zipcodeRestriction,
        usageLimit: updatedCoupon.usageLimit,
        usageCount: updatedCoupon.usageCount,
        usageLimitPerUser: updatedCoupon.usageLimitPerUser,
        validFrom: updatedCoupon.validFrom,
        validUntil: updatedCoupon.validUntil,
        isActive: updatedCoupon.isActive,
        isPublic: updatedCoupon.isPublic,
        applicableTo: updatedCoupon.applicableTo,
        specificItems: updatedCoupon.specificItems,
        specificItemsType: updatedCoupon.specificItemsType,
        createdBy: updatedCoupon.createdBy,
        lastModifiedBy: updatedCoupon.lastModifiedBy,
        totalDiscountGiven: updatedCoupon.totalDiscountGiven,
        totalOrders: updatedCoupon.totalOrders,
        createdAt: updatedCoupon.createdAt,
        updatedAt: updatedCoupon.updatedAt,
        isValid: updatedCoupon.isValid,
        remainingUses: updatedCoupon.remainingUses,
      },
    })
  } catch (error) {
    console.error('Error updating coupon:', error)

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const adminCheck = await requireAdmin()
    if (!adminCheck.success) {
      return adminCheck
    }

    const { couponId } = params

    await connectDB()

    const coupon = await Coupon.findById(couponId)

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found' },
        { status: 404 }
      )
    }

    await Coupon.findByIdAndDelete(couponId)

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
