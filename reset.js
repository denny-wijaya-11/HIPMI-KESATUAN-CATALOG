const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const dns = require('node:dns');

// Fix for querySrv ECONNREFUSED (commonly blocked by Indonesian ISPs)
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function resetPassword() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const dbUriMatch = envContent.match(/MONGODB_URI=(.*)/);
    
    if (!dbUriMatch) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    const uri = dbUriMatch[1].trim().replace(/^["']|["']$/g, '');
    
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('Connected to MongoDB Atlas successfully.');
    
    // Schema yang sama dengan seed.js
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    // ==========================================
    // UBAH DATA DI BAWAH INI SESUAI KEBUTUHAN
    // ==========================================
    const targetEmail = 'admin@hipmi.kesatuan.ac.id'; // Email akun yang mau direset
    const passwordBaru = 'password123'; // Password barunya
    // ==========================================
    
    const existingUser = await User.findOne({ email: targetEmail });
    
    if (!existingUser) {
      console.log(`Akun dengan email ${targetEmail} TIDAK DITEMUKAN di database.`);
    } else {
      console.log(`Akun ditemukan atas nama: ${existingUser.name} (${existingUser.role})`);
      
      // Enkripsi password baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordBaru, salt);
      
      // Update data di database
      await User.updateOne(
        { email: targetEmail },
        { password: hashedPassword }
      );
      
      console.log(`SUKSES! Password untuk ${targetEmail} telah berhasil di-reset.`);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error resetting password:', error.message);
  }
}

resetPassword();
