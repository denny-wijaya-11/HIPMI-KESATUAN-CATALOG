import mongoose from 'mongoose';

function arrayLimit(val) {
  return val.length <= 5;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //JWT Token
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: function() { return this.authProvider === 'local'; },
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ['developer', 'admin', 'operator', 'tenant', 'user'],
    default: 'user',
  },
  tenantStatus: {
    type: String,
    enum: ['none', 'pending', 'paid', 'approved', 'rejected', 'suspended'],
    default: 'none',
  },
  whatsapp: {
    type: String,
    required: function() { return this.role !== 'developer' && this.role !== 'admin'; }
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  city: {
    type: String,
    required: function() { return this.role !== 'developer' && this.role !== 'admin'; }
  },
  university: {
    type: String,
    required: function() { return this.role !== 'developer' && this.role !== 'admin'; }
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  address: {
    type: String,
  },
  savedAddresses: {
    type: [{
      label: { type: String, required: true }, // e.g., "Rumah", "Kost"
      name: { type: String, required: true }, // Receiver's name
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
      notes: { type: String }
    }],
    validate: [arrayLimit, '{PATH} melebihi batas 5 alamat']
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  avatar: {
    type: String,
    default: ''
  },
  fcmToken: {
    type: String,
    default: null
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  paymentMethods: [{
    provider: { type: String, required: true }, // e.g., 'BCA', 'GoPay'
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    qrisImage: { type: String } // URL to the QRIS image
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
