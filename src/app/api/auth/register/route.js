import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    // Cek apakah user sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the password for temporary storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
    });

    // Send email via Nodemailer
    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      console.error('Failed to send OTP via Nodemailer:', emailResult.error);
      // We still return 200 so the user can see the form (for development mode), 
      // but in production we might want to return an error if email sending is critical and fails.
    }

    return NextResponse.json(
      { message: "OTP berhasil dikirim ke email" },
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
