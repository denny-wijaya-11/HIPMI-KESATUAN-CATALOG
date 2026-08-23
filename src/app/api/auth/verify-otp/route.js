import { NextResponse } from "next/server";
import * as jose from "jose";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan OTP wajib diisi" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Cari token yang cocok
    const verificationRecord = await VerificationToken.findOne({ email, token: otp });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "OTP salah atau sudah kedaluwarsa" },
        { status: 400 }
      );
    }

    // Pastikan belum expired (meskipun index TTL harusnya otomatis hapus)
    if (new Date() > verificationRecord.expiresAt) {
      await VerificationToken.deleteOne({ _id: verificationRecord._id });
      return NextResponse.json(
        { error: "OTP sudah kedaluwarsa, silakan daftar ulang" },
        { status: 400 }
      );
    }

    // Buat akun user permanen
    const newUser = await User.create({
      name: verificationRecord.name,
      email: verificationRecord.email,
      password: verificationRecord.password, // Sudah di-hash saat register
      role: 'user', // Default role
      cart: [],
      wishlist: [],
    });

    // Hapus data verifikasi
    await VerificationToken.deleteOne({ _id: verificationRecord._id });

    // Login user otomatis (set cookie JWT)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const token = await new jose.SignJWT({
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json(
      { message: "Verifikasi berhasil, akun dibuat", role: newUser.role },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi" },
      { status: 500 }
    );
  }
}
