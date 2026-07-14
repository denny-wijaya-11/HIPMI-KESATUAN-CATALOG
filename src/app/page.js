import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* Simple Logo Placeholder */}
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
                H
              </div>
              <span className="font-bold text-xl tracking-tight text-blue-900">
                HIPMI <span className="font-light text-gray-500">PT Kesatuan</span>
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Beranda</Link>
              <Link href="#produk" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Katalog Produk</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tentang Kami</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link href="/login" className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all">
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Dukung Pengusaha Muda</span>{' '}
                    <span className="block text-blue-600 xl:inline">IBI Kesatuan</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Temukan dan beli produk-produk kreatif dan inovatif hasil karya mahasiswa pengusaha dari HIPMI Perguruan Tinggi Kesatuan. Dari mahasiswa, oleh mahasiswa, untuk semua!
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-full shadow-lg">
                      <Link href="#produk" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all hover:-translate-y-0.5">
                        Mulai Belanja
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link href="#tentang" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-all">
                        Pelajari Lebih Lanjut
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full relative bg-gray-100">
               <Image 
                 src="/images/hero.png" 
                 alt="Mahasiswa Pengusaha HIPMI PT Kesatuan" 
                 fill
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent lg:block hidden"></div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="produk" className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Katalog UKM</h2>
              <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
                Produk Unggulan Kami
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Pilihan produk terbaik dari anggota HIPMI PT Kesatuan minggu ini.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Product Card 1 */}
              <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image src="/images/coffee.png" alt="Es Kopi Susu Aren" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                    Minuman
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Es Kopi Susu Aren Kekinian</h3>
                    <p className="text-sm text-gray-500 mb-4">Oleh: <span className="font-medium text-blue-600">Kedai Kopi Mahasiswa</span></p>
                    <p className="text-gray-600 text-sm line-clamp-2">Perpaduan espresso pilihan dengan susu segar dan gula aren asli. Bikin melek seharian!</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">Rp 18.000</span>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-colors flex items-center gap-2 px-4 group-hover:bg-green-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-sm font-medium">Beli via WA</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image src="/images/tshirt.png" alt="T-Shirt Minimalis" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                    Fashion
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">T-Shirt Hitam Minimalis Premium</h3>
                    <p className="text-sm text-gray-500 mb-4">Oleh: <span className="font-medium text-blue-600">Apparel Nusantara</span></p>
                    <p className="text-gray-600 text-sm line-clamp-2">Kaos berbahan katun bambu super lembut dengan desain polos elegan yang cocok untuk hangout.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">Rp 125.000</span>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-colors flex items-center gap-2 px-4 group-hover:bg-green-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-sm font-medium">Beli via WA</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <Image src="/images/bag.png" alt="Tote Bag Kanvas" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                    Aksesoris
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Classic Canvas Tote Bag</h3>
                    <p className="text-sm text-gray-500 mb-4">Oleh: <span className="font-medium text-blue-600">Kreasi Tangan</span></p>
                    <p className="text-gray-600 text-sm line-clamp-2">Tas jinjing berbahan kanvas tebal yang ramah lingkungan dengan resleting dan kantong dalam.</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">Rp 55.000</span>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-colors flex items-center gap-2 px-4 group-hover:bg-green-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-sm font-medium">Beli via WA</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Lihat Semua Produk
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Kamu mahasiswa Kesatuan?</span>
              <span className="block text-blue-200">Ayo bergabung dan mulai berjualan!</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors">
                  Daftar Sekarang
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="#tentang" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 transition-colors">
                  Tentang HIPMI PT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                HIPMI <span className="font-light text-gray-400">PT Kesatuan</span>
              </span>
            </div>
            <p className="text-sm">
              Wadah perhimpunan pengusaha muda tingkat perguruan tinggi di IBI Kesatuan Bogor. Membangun ekosistem wirausaha yang kuat di kampus.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="#produk" className="hover:text-white transition-colors">Katalog Produk</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cara Belanja</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>Sekretariat HIPMI PT Kesatuan</li>
              <li>Kampus IBI Kesatuan Bogor</li>
              <li>Email: info@hipmiptkesatuan.org</li>
              <li>Instagram: @hipmiptkesatuan</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; {new Date().getFullYear()} HIPMI PT Kesatuan. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
