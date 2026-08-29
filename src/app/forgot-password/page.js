"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengirim OTP");
      } else {
        setSuccess("Kode OTP telah dikirim ke email Anda.");
        setStep(2);
      }
    } catch (err) {
      setError("Koneksi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTPAndReset = async (e) => {
    e.preventDefault();
    if (step === 2) {
      if (otp.length !== 6) {
        setError("OTP harus 6 angka");
        return;
      }
      // Pindah ke step 3 secara lokal dulu
      setError("");
      setStep(3);
      return;
    }

    if (step === 3) {
      if (password !== confirmPassword) {
        setError("Password dan Konfirmasi Password tidak cocok");
        return;
      }
      
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword: password }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Gagal mereset password");
        } else {
          setSuccess("Password berhasil diubah! Mengarahkan ke halaman login...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        setError("Koneksi gagal");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative w-48 h-32 flex items-center justify-center">
            <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {step === 1 && "Masukkan email yang terdaftar di akun Anda."}
          {step === 2 && "Masukkan kode OTP yang dikirim ke email Anda."}
          {step === 3 && "Buat password baru Anda."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {step === 1 && (
            <form className="space-y-5 animate-in fade-in zoom-in-95 duration-300" onSubmit={handleSendOTP}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Alamat Email (Gmail)
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    placeholder="nama@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Mengirim OTP..." : "Kirim OTP"}
              </button>
            </form>
          )}

          {(step === 2 || step === 3) && (
            <form className="space-y-5 animate-in fade-in zoom-in-95 duration-300" onSubmit={handleVerifyOTPAndReset}>
              {step === 2 && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center">
                    Kode Verifikasi (OTP)
                  </label>
                  <div className="mt-3">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // hanya angka
                      placeholder="• • • • • •"
                      className="block w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-500">
                    OTP dikirim ke <span className="font-semibold text-gray-900">{email}</span>
                  </p>
                </div>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      Password Baru
                    </label>
                    <div className="mt-1.5 relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 013.83-2.11M12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" /></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Konfirmasi Password Baru
                    </label>
                    <div className="mt-1.5 relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || (step === 2 && otp.length !== 6)}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : step === 2 ? "Verifikasi OTP" : "Reset Password"}
                </button>
                
                <button
                  type="button"
                  className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none transition-all"
                  onClick={() => {
                    if (step === 3) setStep(2);
                    else {
                      setStep(1);
                      setOtp("");
                      setError("");
                    }
                  }}
                  disabled={isLoading}
                >
                  Kembali
                </button>
              </div>
            </form>
          )}

        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Ingat password Anda?{" "}
          <Link href="/login" className="font-semibold text-[#C62828] hover:text-[#8E0000] transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
