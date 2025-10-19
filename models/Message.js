import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MessageThread',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
MessageSchema.index({ thread: 1, createdAt: -1 })
MessageSchema.index({ sender: 1 })
MessageSchema.index({ read: 1 })

export default mongoose.models.Message ||
  mongoose.model('Message', MessageSchema)
