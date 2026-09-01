import Link from 'next/link';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import PublicHeader from '@/components/public/PublicHeader';

export const dynamic = 'force-dynamic';

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload; // { id, email, role, name }
  } catch (err) {
    return null;
  }
}

async function getBuyerOrders(buyerId) {
  await dbConnect();
  const orders = await Order.find({ buyer: buyerId })
    .populate('tenant', 'name avatar')
    .populate({
      path: 'items.product',
      select: 'name image price'
    })
    .sort({ createdAt: -1 })
    .lean();
  return orders;
}

export default async function BuyerOrdersPage() {
  const user = await getUserPayload();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Link href="/login" className="text-red-600 hover:underline">Silakan Login Terlebih Dahulu</Link>
      </div>
    );
  }

  const orders = await getBuyerOrders(user.id);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-800 font-sans">
      <PublicHeader user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan Saya</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 mb-6">Anda belum pernah melakukan pemesanan apa pun di HIPMORA.</p>
            <Link href="/products" className="inline-block bg-[#C62828] hover:bg-[#8E0000] text-white px-6 py-2.5 rounded-full font-medium transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
              
              let statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
              if (order.status === 'Diproses') statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
              if (order.status === 'Dikirim') statusColor = 'bg-purple-100 text-purple-800 border-purple-200';
              if (order.status === 'Selesai') statusColor = 'bg-green-100 text-green-800 border-green-200';
              if (order.status === 'Dibatalkan') statusColor = 'bg-red-100 text-red-800 border-red-200';

              return (
                <div key={order._id.toString()} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Tanggal Belanja</p>
                        <p className="font-semibold text-gray-900 text-sm">{date}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Toko / Penjual</p>
                        <p className="font-semibold text-gray-900 text-sm">{order.tenant?.name || 'Toko tidak diketahui'}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 mb-4 pb-4 border-b border-gray-50 last:mb-0 last:pb-0 last:border-0">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 border border-gray-200 overflow-hidden relative">
                           {(item.product?.images && item.product.images.length > 0) ? (
                             <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                           ) : item.product?.image ? (
                             <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.product?.name || 'Produk telah dihapus'}</h3>
                          <p className="text-xs text-gray-500 mt-1">{item.quantity} x Rp {item.price?.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900 text-sm">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.status === 'Menunggu Pembayaran' && order.paymentInstructions && order.paymentInstructions.length > 0 && (
                    <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <h4 className="text-amber-800 text-xs font-bold mb-3 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Segera Lakukan Pembayaran ke Penjual
                      </h4>
                      <div className="space-y-3">
                        {order.paymentInstructions.map((method, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-amber-200/60 rounded-lg bg-white">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{method.provider}</p>
                              <p className="text-lg font-mono text-gray-800 tracking-wider my-0.5">{method.accountNumber}</p>
                              <p className="text-xs text-gray-500 uppercase">a.n. {method.accountName}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Total Belanja</p>
                      <p className="font-bold text-[#C62828] text-lg">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                    </div>
                    <Link 
                      href={`/chat?userId=${order.tenant?._id}&userName=${order.tenant?.name}`}
                      className="inline-flex justify-center items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 px-5 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Chat Penjual
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
