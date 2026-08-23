import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Di Vercel, kita akan menggunakan Environment Variables
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in the private key when loaded from process.env
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Di Local Development (komputer kamu), kita menggunakan file JSON langsung
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.join(process.cwd(), 'firebase-admin-key.json');
      
      if (fs.existsSync(keyPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        console.warn('Firebase Admin: Local key not found and no environment variables set.');
      }
    }
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
