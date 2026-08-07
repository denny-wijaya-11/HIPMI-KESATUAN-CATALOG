import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
  },
  category: {
    type: String,
    enum: ['Makanan', 'Minuman', 'Fashion', 'Aksesoris', 'Jasa', 'Lainnya'],
    default: 'Lainnya'
  },
  image: {
    type: String,
    default: '/images/placeholder.png'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
