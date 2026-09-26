import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email wajib diisi" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Generate 6-digit OTP using crypto for better randomness
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set expiry to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Check rate limit: max 2 reset requests per hour per email
    const recentTokens = await VerificationToken.find({ 
      email, 
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } 
    }).sort({ createdAt: -1 }).limit(2);
    
    if (recentTokens.length >= 2) {
      // Always return generic message to prevent user enumeration
      return NextResponse.json(
        { message: "Jika email terdaftar, OTP reset password telah dikirim. Silakan cek inbox atau tunggu 1 jam sebelum meminta ulang." },
        { status: 200 }
      );
    }

    // Delete any existing OTP for this email to prevent spam
    await VerificationToken.deleteMany({ email });

    // Save the new OTP (only if user exists - but we don't reveal this)
    if (user) {
      await VerificationToken.create({
        email,
        name: user.name || "User",
        whatsapp: user.whatsapp || "-",
        university: user.university || "-",
        city: user.city || "-",
        password: "RESET_PASSWORD_TOKEN", // dummy
        token: otp,
        expiresAt,
        attempts: 0,
      });

      // Send the OTP via email
      const emailResult = await sendOTPEmail(email, otp);
      if (!emailResult.success) {
        console.error('Failed to send OTP via Nodemailer:', emailResult.error);
      }
    }

    // Always return generic message to prevent user enumeration
    return NextResponse.json(
      { message: "Jika email terdaftar, OTP reset password telah dikirim ke email Anda" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
