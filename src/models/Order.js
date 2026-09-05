import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variantName: {
    type: String
  },
  price: {
    type: Number,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    notes: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ['manual_transfer'],
    default: 'manual_transfer'
  },
  paymentInstructions: [{
    provider: String,
    accountNumber: String,
    accountName: String
  }],
  paymentProof: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
    default: 'Menunggu Pembayaran'
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
