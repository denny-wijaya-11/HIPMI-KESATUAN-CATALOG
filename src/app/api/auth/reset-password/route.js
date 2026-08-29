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

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // 1. Find the Verification Token
    const verificationRecord = await VerificationToken.findOne({ email, token: otp });
    
    if (!verificationRecord) {
      return NextResponse.json(
        { error: "OTP salah atau tidak ditemukan" },
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
    const salt = await bcryptjs.genSalt(10);
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
