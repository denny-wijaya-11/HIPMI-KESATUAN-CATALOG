import { NextResponse } from "next/server";
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
    if (!user) {
      return NextResponse.json(
        { error: "Email tidak terdaftar di sistem kami" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing OTP for this email to prevent spam
    await VerificationToken.deleteMany({ email });

    // Save the new OTP
    // We don't need to save a dummy password here because this is just a reset token,
    // but the VerificationToken schema requires `password` and `name` temporarily.
    // Let's pass dummy values for those required fields since we only need the token.
    await VerificationToken.create({
      email,
      name: user.name,
      password: "RESET_PASSWORD_TOKEN", // dummy
      token: otp,
      expiresAt,
    });

    // Send the OTP via email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      console.error('Failed to send OTP via Nodemailer:', emailResult.error);
      return NextResponse.json(
        { error: "Gagal mengirim email OTP, pastikan email valid" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP berhasil dikirim ke email" },
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
