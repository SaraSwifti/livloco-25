import { Schema, model, models } from 'mongoose'

const FeedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    userPhone: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'deleted'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

// Index for fetching feedback by status
FeedbackSchema.index({ status: 1, createdAt: -1 })

const Feedback = models.Feedback || model('Feedback', FeedbackSchema)
export default Feedback
