'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="relative w-48 h-10 hover:opacity-80 transition-opacity">
              <Image src="/images/MASKOT LOGO.png" alt="HIPMORA Logo" fill className="object-contain object-left" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden sm:flex text-sm font-medium text-gray-500 hover:text-[#C62828] transition-colors items-center gap-2">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Syarat & Ketentuan (S&K) Produk HIPMORA</h1>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
              <h2 className="text-lg font-bold text-[#C62828] mb-4">Ketentuan Gambar Produk</h2>
              <ol className="list-decimal pl-5 space-y-3 font-medium text-gray-800">
                <li>Ukuran gambar produk yakni <strong>1:1</strong> (Persegi).</li>
                <li>Format gambar produk direkomendasikan dengan format <strong>.webp</strong>.</li>
                <li>Background gambar produk <strong>wajib</strong> menggunakan warna dengan kode <span className="inline-block px-2 py-1 bg-[#b6b09f] text-white rounded text-sm">#b6b09f</span>.</li>
                <li>Gambar <strong>tidak boleh</strong> mengandung unsur negatif (SARA, Rasisme, dll.)</li>
                <li><strong>Tidak boleh</strong> mencantumkan produk/jasa ilegal (Obat-obatan terlarang, dll.)</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 mt-8">Cara Upload Produk (Google Drive)</h2>
              <p className="mb-4">Berikut terlampir cara upload produk:</p>
              <ol className="list-[upper-alpha] pl-5 space-y-4">
                <li>
                  Masuk ke akun yang terdaftar sebagai tenant di platform HIPMORA Katalog dengan email ataupun akun Google.
                </li>
                <li>
                  Setelah Login, tekan bagian <strong>Produk Saya</strong> pada menu navigasi bagian kiri halaman.
                </li>
                <li>
                  Klik tombol <strong>Tambah Produk</strong>.
                </li>
                <li>
                  Isi form Nama, Harga, Kategori, URL Gambar, dan Deskripsi produk secara lengkap.
                </li>
                <li>
                  Untuk mendapatkan URL gambar, pertama buka <strong>Google Drive</strong> pada perangkat Anda. Lalu tekan tombol <strong>Baru (+)</strong>.
                </li>
                <li>
                  Pilih opsi <strong>Upload File</strong> dan pilih gambar produk Anda (pastikan sudah sesuai S&K gambar di atas).
                </li>
                <li>
                  Setelah berhasil di-upload, klik titik 3 (Opsi Lainnya) pada nama file produk tersebut.
                </li>
                <li>
                  Pilih menu <strong>Bagikan</strong> (Share).
                </li>
                <li>
                  Ubah hak akses yang awalnya <em>Private</em> (Dibatasi) menjadi <strong>Public (Siapa saja yang memiliki link / Anyone with the link)</strong>.
                </li>
                <li>
                  <strong>Salin (Copy) link</strong> gambar tersebut, lalu kembali ke halaman Tambah Produk HIPMORA dan <strong>Tempel (Paste)</strong> ke kolom <em>URL Gambar</em>.
                </li>
                <li>
                  Terakhir, tekan tombol <strong>Simpan Produk</strong> lalu selesai. Produk Anda akan otomatis tampil di Katalog.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
