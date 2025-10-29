import mongoose from 'mongoose'

const BlockedUserSchema = new mongoose.Schema(
  {
    // The user who blocked someone
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who was blocked
    blocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Information about the original thread that was deleted
    originalThreadInfo: {
      postingType: {
        type: String,
        enum: ['business', 'hostfarmmarket'],
        required: true,
      },
      postingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      postingName: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
BlockedUserSchema.index({ blocker: 1, blocked: 1 }, { unique: true })
BlockedUserSchema.index({ blocker: 1 })
BlockedUserSchema.index({ blocked: 1 })

export default mongoose.models.BlockedUser ||
  mongoose.model('BlockedUser', BlockedUserSchema)


