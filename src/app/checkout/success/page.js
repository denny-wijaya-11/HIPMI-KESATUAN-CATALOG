import Link from 'next/link';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

async function getOrdersData(orderIdsString) {
  if (!orderIdsString) return [];
  
  const ids = orderIdsString.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
  if (ids.length === 0) return [];

  await dbConnect();
  
  // Fetch orders and populate tenant to get tenant name
  const orders = await Order.find({ _id: { $in: ids } })
    .populate('tenant', 'name')
    .lean();
    
  return orders;
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const orders = await getOrdersData(resolvedSearchParams.orders);

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-sm p-6 sm:p-10 rounded-2xl w-full text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed max-w-lg mx-auto">
            Terima kasih telah berbelanja di HIPMORA. Pesanan Anda telah diteruskan ke masing-masing Penjual (Tenant).
          </p>
        </div>

        {orders.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 px-2">Instruksi Pembayaran</h2>
            
            {orders.map((order) => (
              <div key={order._id.toString()} className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pesanan untuk Toko</p>
                    <p className="font-bold text-gray-900">{order.tenant?.name || 'Tenant HIPMORA'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total Tagihan</p>
                    <p className="font-bold text-[#C62828] text-lg">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {order.paymentInstructions && order.paymentInstructions.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-700 mb-4">
                        Silakan transfer sebesar <strong className="text-[#C62828]">Rp {order.totalAmount?.toLocaleString('id-ID')}</strong> ke salah satu rekening penjual di bawah ini:
                      </p>
                      
                      <div className="space-y-3">
                        {order.paymentInstructions.map((method, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{method.provider}</p>
                              <p className="text-lg font-mono text-gray-800 tracking-wider my-1">{method.accountNumber}</p>
                              <p className="text-xs text-gray-500 uppercase">a.n. {method.accountName}</p>
                            </div>
                            {/* Copy button UI only, using a simple title for now since it's a server component without onClick */}
                            <div className="text-xs font-semibold text-gray-400 border border-gray-200 px-3 py-1.5 rounded bg-white">
                              {method.provider}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">Setelah melakukan transfer, silakan konfirmasi dengan mengirimkan bukti transfer via Chat ke penjual.</p>
                        <Link 
                          href={`/chat?userId=${order.tenant?._id}&userName=${encodeURIComponent(order.tenant?.name || '')}`}
                          className="inline-flex justify-center items-center w-full sm:w-auto bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors"
                        >
                          Chat Penjual Sekarang
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-600 mb-3">Penjual ini belum mencantumkan metode pembayaran otomatis.</p>
                      <Link 
                        href={`/chat?userId=${order.tenant?._id}&userName=${encodeURIComponent(order.tenant?.name || '')}`}
                        className="inline-flex justify-center items-center bg-[#C62828] hover:bg-[#8E0000] text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors"
                      >
                        Tanya Rekening via Chat
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pb-12">
          <Link 
            href="/" 
            className="inline-block bg-[#C62828] hover:bg-[#8E0000] text-white text-sm font-semibold py-3 px-8 rounded-xl transition-colors shadow-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
