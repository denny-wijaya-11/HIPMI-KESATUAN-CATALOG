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
    required: [true, 'Please provide a password'],
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
    enum: ['developer', 'admin', 'operator'], //Pemilihan role yang tersedia
    default: 'operator',
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
