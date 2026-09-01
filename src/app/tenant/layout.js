import TenantShell from '@/components/tenant/TenantShell';
import { getUserPayload } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const metadata = {
  title: 'Dashboard Penjual | HIPMORA',
  description: 'Kelola produk dan pesanan toko Anda',
};

export default async function TenantLayout({ children }) {
  const payload = await getUserPayload();
  let isSuspended = false;

  if (payload && payload.id) {
    await dbConnect();
    const user = await User.findById(payload.id);
    if (user?.tenantStatus === 'suspended') {
      isSuspended = true;
    }
  }

  if (isSuspended) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-red-600">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Akun Ditangguhkan</h2>
          <p className="text-gray-600 mb-6">
            Akses ke Dashboard Tenant Anda sedang ditangguhkan karena belum menyelesaikan pembayaran sewa bulanan. Produk Anda juga disembunyikan dari katalog publik.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || ''}?text=Halo%20Admin,%20saya%20sudah%20melakukan%20pembayaran%20sewa%20tenant%20atas%20nama%20${encodeURIComponent(user?.name || '')}.%20Berikut%20bukti%20pembayarannya:`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
          >
            Konfirmasi Sudah Bayar (WA)
          </a>
        </div>
      </div>
    );
  }

  return <TenantShell>{children}</TenantShell>;
}
