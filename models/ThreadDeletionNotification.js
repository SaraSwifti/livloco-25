import mongoose from 'mongoose'

const ThreadDeletionNotificationSchema = new mongoose.Schema(
  {
    // The user who will receive the notification (the one who didn't delete)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who deleted the thread
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Information about the deleted thread
    threadInfo: {
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
    // Whether the notification has been seen/dismissed
    isRead: {
      type: Boolean,
      default: false,
    },
    // When the notification was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
ThreadDeletionNotificationSchema.index({ recipient: 1, isRead: 1 })
ThreadDeletionNotificationSchema.index({ createdAt: -1 })

export default mongoose.models.ThreadDeletionNotification ||
  mongoose.model('ThreadDeletionNotification', ThreadDeletionNotificationSchema)


