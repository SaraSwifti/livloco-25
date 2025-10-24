import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema(
  {
    // Basic coupon information
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Discount details
    discountType: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Usage limits
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimitPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Validity period
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },

    // Status and visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Applicable to specific items (optional)
    applicableTo: {
      type: String,
      enum: ['all', 'businesses', 'markets', 'specific'],
      default: 'all',
    },
    specificItems: [{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'specificItemsType',
    }],
    specificItemsType: {
      type: String,
      enum: ['LocoBiz', 'HostFMarket'],
    },

    // Admin tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Analytics
    totalDiscountGiven: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
CouponSchema.index({ code: 1 })
CouponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 })
CouponSchema.index({ createdBy: 1 })
CouponSchema.index({ applicableTo: 1 })

// Virtual for checking if coupon is currently valid
CouponSchema.virtual('isValid').get(function() {
  const now = new Date()
  return this.isActive && 
         this.validFrom <= now && 
         this.validUntil >= now &&
         (this.usageLimit === null || this.usageCount < this.usageLimit)
})

// Virtual for remaining uses
CouponSchema.virtual('remainingUses').get(function() {
  if (this.usageLimit === null) return null
  return Math.max(0, this.usageLimit - this.usageCount)
})

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)

