import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productContext: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  content: {
    type: String,
    maxlength: 2000
  },
  image: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Add TTL (Time-To-Live) index on createdAt to automatically delete messages after 7 days
// 7 days = 7 * 24 * 60 * 60 = 604800 seconds
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
