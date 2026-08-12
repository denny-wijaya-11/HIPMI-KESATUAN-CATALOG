import TenantShell from '@/components/tenant/TenantShell';

export const metadata = {
  title: 'Dashboard Penjual | HIPMORA',
  description: 'Kelola produk dan pesanan toko Anda',
};

export default function TenantLayout({ children }) {
  return <TenantShell>{children}</TenantShell>;
}
