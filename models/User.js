import { Schema, model, models } from 'mongoose'

// Import LocoBiz to ensure it's registered before User model references it
import './LocoBiz.js'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    image: {
      type: String,
    },
    full_name: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, match: /^\+1\d{10}$/ }, // E.164 US
    email_memmessage_notification: { type: Boolean, default: false },

    // Location preferences for search
    location_preferences: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
      zipcode: { type: String, match: /^\d{5}(-\d{4})?$/ },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      last_updated: { type: Date, default: Date.now },
    },
    payment_confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    profile_choice: {
      type: String,
      enum: ['none', 'locobiz', 'hostfmarket'],
      default: 'none',
    },
    locobiz: { type: Schema.Types.ObjectId, ref: 'LocoBiz', sparse: true },
    hostfmarket: {
      type: Schema.Types.ObjectId,
      ref: 'HostFMarket',
      sparse: true,
    },
    // Track saved businesses and markets
    saved_businesses: {
      type: [{ type: Schema.Types.ObjectId, ref: 'LocoBiz' }],
      default: [],
    },
    saved_markets: {
      type: [{ type: Schema.Types.ObjectId, ref: 'HostFMarket' }],
      default: [],
    },

    // Legacy bookmarks field (keeping for backwards compatibility)
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LocoBiz',
      },
    ],

    // Track which businesses and markets this user has voted for
    voted_businesses: {
      type: [{ type: Schema.Types.ObjectId, ref: 'LocoBiz' }],
      default: [],
    },
    voted_markets: {
      type: [{ type: Schema.Types.ObjectId, ref: 'HostFMarket' }],
      default: [],
    },

    // Admin role for site administration
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },

    // Admin permissions (for future expansion)
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model('User', UserSchema)

export default User
