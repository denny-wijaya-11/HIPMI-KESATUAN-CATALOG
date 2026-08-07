const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const dns = require('node:dns');

// Fix for querySrv ECONNREFUSED (commonly blocked by Indonesian ISPs)
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function seed() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const dbUriMatch = envContent.match(/MONGODB_URI=(.*)/);
    
    if (!dbUriMatch) {
      throw new Error('MONGODB_URI not found in .env.local');
    }
    
    const uri = dbUriMatch[1].trim().replace(/^["']|["']$/g, '');
    
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('Connected to MongoDB Atlas successfully.');
    
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    });
    
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    const email = '';
    const password = ''; // Bisa diganti nanti
    const name = ''; // Bisa diganti nanti
    const role = ''; // Menjadikan dia sebagai operator
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Akun ${email} sudah ada di database.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await User.create({
        email,
        password: hashedPassword,
        name,
        role
      });
      console.log(`Akun ${role} untuk ${name} berhasil dibuat!`);
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
}

seed();
