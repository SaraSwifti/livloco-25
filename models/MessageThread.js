import mongoose from 'mongoose'

const MessageThreadSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    // The user who initiated the thread (has a business/market posting)
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who was messaged (may or may not have a posting)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Reference to the business or market that initiated the conversation
    postingType: {
      type: String,
      enum: ['business', 'hostfarmmarket'],
      required: true,
    },
    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Track who has blocked whom
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Auto-deletion date (6 months from last message)
    autoDeleteAt: {
      type: Date,
      default: () => new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
MessageThreadSchema.index({ participants: 1, lastMessageAt: -1 })
MessageThreadSchema.index({ initiator: 1 })
MessageThreadSchema.index({ recipient: 1 })
MessageThreadSchema.index({ autoDeleteAt: 1 })

// Update auto-deletion date when last message changes
MessageThreadSchema.pre('save', function (next) {
  if (this.isModified('lastMessageAt')) {
    this.autoDeleteAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
  }
  next()
})

export default mongoose.models.MessageThread ||
  mongoose.model('MessageThread', MessageThreadSchema)
