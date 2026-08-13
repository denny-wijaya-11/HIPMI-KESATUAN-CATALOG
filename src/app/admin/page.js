import User from "@/models/User";
import Product from "@/models/Product";
import SiteStat from "@/models/SiteStat";
import dbConnect from "@/lib/mongodb";
import Link from "next/link";

export const dynamic = 'force-dynamic';

// Connect to DB helper (since Server Components in App Router need to ensure connection)
async function getStats() {
  await dbConnect();

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  const siteStat = await SiteStat.findOne({ id: 'global' });
  const totalVisitors = siteStat ? siteStat.totalVisitors.toLocaleString() : "0";
  
  // Realtime new products this week
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newProductsCount = await Product.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const newProducts = newProductsCount.toString();

  return { totalUsers, totalProducts, totalVisitors, newProducts };
}

export default async function AdminDashboard() {
  const data = await getStats();

  const stats = [
    { name: "Total Produk", stat: data.totalProducts, change: "Data Real", changeType: "increase" },
    { name: "Total Akun (Admin/Operator)", stat: data.totalUsers, change: "Data Real", changeType: "increase" },
    { name: "Total Pengunjung", stat: data.totalVisitors, change: "Data Real", changeType: "increase" },
    { name: "Produk Baru (Minggu Ini)", stat: data.newProducts, change: "Data Real", changeType: "increase" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Ringkasan performa dan data katalog HIPMORA
      </p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <dt>
              <div className="absolute bg-red-500 rounded-lg p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.name.includes("Produk") ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  ) : item.name.includes("Akun") ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold
                  ${item.changeType === "increase" ? "text-green-600" : "text-red-600"}
                `}
              >
                <span className="sr-only">{item.changeType === "increase" ? "Increased by" : "Decreased by"}</span>
                {item.change}
              </p>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-red-600 hover:text-red-500 transition-colors">
                    Lihat detail <span className="sr-only">{item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {[
                { content: "Sistem Dasbor", target: "Diperbarui dengan Next.js App Router", date: "Hari ini" },
              ].map((event, eventIdx) => (
                <li key={eventIdx}>
                  <div className="relative pb-8">
                    {eventIdx !== 0 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {event.content}{' '}
                            <span className="font-medium text-gray-900">
                              {event.target}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={event.date}>{event.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/create" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors group">
              <svg className="h-8 w-8 text-gray-400 group-hover:text-red-500 mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-gray-900 group-hover:text-red-700">Tambah Produk</span>
            </Link>
            <Link href="/admin/users" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors group">
              <svg className="h-8 w-8 text-gray-400 group-hover:text-red-500 mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium text-gray-900 group-hover:text-red-700">Kelola Akun</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
