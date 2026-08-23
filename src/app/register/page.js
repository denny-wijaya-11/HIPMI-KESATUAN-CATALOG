"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

function RegisterContent() {
  const [step, setStep] = useState(1); // 1: Form Register, 2: Form OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal melakukan registrasi");
        setIsLoading(false);
        return;
      }

      // Sukses mengirim OTP, lanjut ke step 2
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setError("Gagal terhubung ke server");
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "OTP tidak valid");
        setIsLoading(false);
        return;
      }

      // Berhasil verifikasi, auto login, redirect ke Home
      router.push("/");
    } catch (err) {
      setError("Gagal terhubung ke server");
      setIsLoading(false);
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
          {step === 1 ? "Daftar Akun Baru" : "Verifikasi Email"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 px-4">
          {step === 1 
            ? "Bergabunglah dengan Platform Katalog Resmi HIPMORA" 
            : `Masukkan 6 digit kode rahasia yang telah dikirimkan ke email ${email}`
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleRegister}>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <div className="mt-1.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    placeholder="Nama Anda"
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    placeholder="Gmail Anda"
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1.5 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] text-sm transition-all pr-10 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </button>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="font-semibold text-[#C62828] hover:text-[#8E0000]">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOTP}>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center">
                  Kode Verifikasi (OTP)
                </label>
                <div className="mt-4 flex justify-center">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // hanya angka
                    className="appearance-none block w-full max-w-[200px] text-center text-3xl tracking-widest px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C62828] focus:border-[#C62828] font-mono bg-gray-50"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#C62828] hover:bg-[#8E0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(""); setError(""); }}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Ganti Email
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-sans text-gray-500">Memuat...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
