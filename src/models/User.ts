import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types';

function arrayLimit(val: any[]) {
  return val.length <= 5;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: function(this: any) { return this.authProvider === 'local'; },
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
    required: function(this: any) { return this.role !== 'developer' && this.role !== 'admin'; }
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  city: {
    type: String,
    required: function(this: any) { return this.role !== 'developer' && this.role !== 'admin'; }
  },
  university: {
    type: String,
    required: function(this: any) { return this.role !== 'developer' && this.role !== 'admin'; }
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
      label: { type: String, required: true },
      name: { type: String, required: true },
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
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  paymentMethods: [{
    provider: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    qrisImage: { type: String }
  }]
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
