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
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
MessageThreadSchema.index({ participants: 1, lastMessageAt: -1 })
MessageThreadSchema.index({ initiator: 1 })
MessageThreadSchema.index({ recipient: 1 })

export default mongoose.models.MessageThread ||
  mongoose.model('MessageThread', MessageThreadSchema)
