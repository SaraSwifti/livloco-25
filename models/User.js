import { Schema, model, models } from 'mongoose'

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
      default: []
    },
    saved_markets: {
      type: [{ type: Schema.Types.ObjectId, ref: 'HostFMarket' }],
      default: []
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
      default: []
    },
    voted_markets: {
      type: [{ type: Schema.Types.ObjectId, ref: 'HostFMarket' }],
      default: []
    },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model('User', UserSchema)

export default User
