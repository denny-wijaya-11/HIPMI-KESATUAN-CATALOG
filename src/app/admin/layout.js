import AdminShell from "@/components/admin/AdminShell";
import { getUserPayload } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel - HIPMI PT Kesatuan",
  description: "Dashboard admin untuk mengelola katalog produk dan anggota",
};

export default async function AdminLayout({ children }) {
  const user = await getUserPayload();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  return <AdminShell>{children}</AdminShell>;
}
