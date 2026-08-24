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
    enum: ['Makanan', 'Minuman', 'Fashion', 'Aksesoris', 'Perlengkapan', 'Jasa', 'Lainnya'],
    default: 'Lainnya'
  },
  region: {
    type: String,
    required: [true, 'Please provide a region'],
    enum: [
      'Jakarta', 'Kota Bogor', 'Kab. Bogor', 'Kota Depok', 'Kota Tangerang', 'Kota Tangerang Selatan', 'Kab. Tangerang', 'Kota Bekasi', 'Kab. Bekasi',
      'Kota Bandung', 'Kab. Bandung', 'Kab. Bandung Barat', 'Kota Cimahi', 'Kota Sukabumi', 'Kab. Sukabumi', 'Kota Cirebon', 'Kab. Cirebon',
      'Kota Tasikmalaya', 'Kab. Tasikmalaya', 'Kota Banjar', 'Kab. Ciamis', 'Kab. Cianjur', 'Kab. Garut', 'Kab. Indramayu', 'Kab. Karawang',
      'Kab. Kuningan', 'Kab. Majalengka', 'Kab. Pangandaran', 'Kab. Purwakarta', 'Kab. Subang', 'Kab. Sumedang'
    ]
  },
  isFromUniversity: {
    type: Boolean,
    default: true
  },
  university: {
    type: String
  },
  address: {
    type: String
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
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  reviews: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
