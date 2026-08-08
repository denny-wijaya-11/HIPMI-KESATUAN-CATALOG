import mongoose from 'mongoose';

const siteStatSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: 'global',
  },
  totalVisitors: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.SiteStat || mongoose.model('SiteStat', siteStatSchema);
