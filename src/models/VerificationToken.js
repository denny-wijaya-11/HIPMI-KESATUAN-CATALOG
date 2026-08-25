import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: { // We need to temporarily store hashed password so we can create user after OTP is verified
    type: String,
    required: true,
  },
  token: { // The 6-digit OTP
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
}, { timestamps: true });

// Buat index yang akan otomatis menghapus dokumen ketika expiresAt lewat (TTL index)
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;
