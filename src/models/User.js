import mongoose from 'mongoose';

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
  city: {
    type: String,
  },
  university: {
    type: String,
  },
  isStudent: {
    type: Boolean,
    default: true
  },
  address: {
    type: String,
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
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
