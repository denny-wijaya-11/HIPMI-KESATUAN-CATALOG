import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { name, email, whatsapp, password, university, city } = await request.json();

    if (!name || !email || !whatsapp || !password || !university || !city) {
      return NextResponse.json(
        { error: "Nama, email, nomor WhatsApp, password, universitas, dan domisili wajib diisi" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate 6-digit OTP using crypto for better randomness
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash the password for temporary storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Check rate limit: max 3 OTP requests per hour per email
    const recentTokens = await VerificationToken.find({ 
      email, 
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } 
    }).sort({ createdAt: -1 }).limit(3);
    
    if (recentTokens.length >= 3) {
      return NextResponse.json(
        { message: "Jika email terdaftar, OTP telah dikirim. Silakan cek inbox atau tunggu 1 jam sebelum meminta ulang." },
        { status: 200 }
      );
    }

    // Delete any existing OTP for this email to prevent spam
    await VerificationToken.deleteMany({ email });

    // Save the new OTP and temporary user data
    await VerificationToken.create({
      name,
      email,
      whatsapp,
      university,
      city,
      password: hashedPassword,
      token: otp,
      expiresAt,
      attempts: 0,
    });

    // Send email via Nodemailer
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP via Nodemailer:', emailResult.error);
    }

    // Always return generic message to prevent user enumeration
    return NextResponse.json(
      { message: "Jika email terdaftar, OTP telah dikirim ke email Anda" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pendaftaran" },
      { status: 500 }
    );
  }
}
