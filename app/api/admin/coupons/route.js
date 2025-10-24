import { NextResponse } from 'next/server'
import connectDB from '@/config/database'
import Coupon from '@/models/Coupon'
import { requireAdmin } from '@/utils/adminMiddleware'

export async function GET() {
  try {
    const adminCheck = await requireAdmin()
    if (!adminCheck.success) {
      return adminCheck
    }

    await connectDB()

    const coupons = await Coupon.find()
      .populate('createdBy', 'full_name email')
      .populate('lastModifiedBy', 'full_name email')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      coupons: coupons.map((coupon) => ({
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
      })),
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const adminCheck = await requireAdmin()
    if (!adminCheck.success) {
      return adminCheck
    }

    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      zipcodeRestriction,
      usageLimit,
      usageLimitPerUser,
      validFrom,
      validUntil,
      isActive,
      isPublic,
      applicableTo,
      specificItems,
      specificItemsType,
    } = await request.json()

    // Validation
    if (
      !code ||
      !name ||
      !discountType ||
      !discountValue ||
      !validFrom ||
      !validUntil
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return NextResponse.json(
        { success: false, error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      )
    }

    if (new Date(validFrom) >= new Date(validUntil)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid until date must be after valid from date',
        },
        { status: 400 }
      )
    }

    await connectDB()

    const coupon = new Coupon({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      zipcodeRestriction: zipcodeRestriction || 0,
      usageLimit: usageLimit || null,
      usageLimitPerUser: usageLimitPerUser || 1,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      isActive: isActive !== undefined ? isActive : true,
      isPublic: isPublic !== undefined ? isPublic : true,
      applicableTo: applicableTo || 'all',
      specificItems: specificItems || [],
      specificItemsType: specificItemsType || null,
      createdBy: adminCheck.user.id,
      lastModifiedBy: adminCheck.user.id,
    })

    await coupon.save()

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
    console.error('Error creating coupon:', error)

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
