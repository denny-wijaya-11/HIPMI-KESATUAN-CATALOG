import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
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
      password: hashedPassword,
      token: otp,
      expiresAt,
    });

    // Send email with Resend using standard HTML (no template ID)
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'sistem@hipmora.my.id';
    
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: `HIPMORA <${FROM_EMAIL}>`,
        to: email,
        subject: 'Kode Verifikasi Pendaftaran HIPMORA',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #C62828; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">HIPMORA</h1>
            </div>
            <div style="padding: 30px; background-color: #FAFAF8;">
              <h2 style="color: #333; margin-top: 0;">Halo ${name},</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.5;">
                Terima kasih telah mendaftar di aplikasi HIPMORA. Untuk menyelesaikan proses pendaftaran Anda, silakan masukkan kode verifikasi (OTP) berikut di aplikasi:
              </p>
              <div style="background-color: white; border: 2px dashed #C62828; border-radius: 8px; padding: 15px; text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #C62828;">${otp}</span>
              </div>
              <p style="color: #777; font-size: 14px; margin-bottom: 0;">
                <em>Kode ini hanya berlaku selama 10 menit. Jangan berikan kode ini kepada siapa pun.</em>
              </p>
            </div>
          </div>
        `
      });
    } else {
      console.log('OTP Generated (no Resend key):', otp);
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
