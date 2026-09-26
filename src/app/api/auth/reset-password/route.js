import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, dan Password Baru wajib diisi" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json(
        { error: "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol" },
        { status: 400 }
      );
    }

    // 1. Find the Verification Token
    const verificationRecord = await VerificationToken.findOne({ email, token: otp });
    
    if (!verificationRecord) {
      // Increment attempts for rate limiting
      await VerificationToken.updateOne(
        { email },
        { $inc: { attempts: 1 } }
      );
      return NextResponse.json(
        { error: "OTP salah atau tidak ditemukan" },
        { status: 400 }
      );
    }

    // Check max attempts (5)
    if (verificationRecord.attempts >= 5) {
      await VerificationToken.deleteOne({ _id: verificationRecord._id });
      return NextResponse.json(
        { error: "Terlalu banyak percobaan gagal. Silakan minta OTP baru." },
        { status: 400 }
      );
    }

    // 2. Check if expired
    if (new Date() > verificationRecord.expiresAt) {
      // Delete the expired token
      await VerificationToken.deleteOne({ _id: verificationRecord._id });
      return NextResponse.json(
        { error: "OTP sudah kedaluwarsa, silakan minta OTP baru" },
        { status: 400 }
      );
    }

    // 3. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Update Password
    const salt = await bcryptjs.genSalt(12); // Increased cost factor
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    // 5. Delete the token
    await VerificationToken.deleteOne({ _id: verificationRecord._id });

    return NextResponse.json(
      { message: "Password berhasil diubah" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
