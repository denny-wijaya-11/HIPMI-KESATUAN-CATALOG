import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel - HIPMI PT Kesatuan",
  description: "Dashboard admin untuk mengelola katalog produk dan anggota",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
