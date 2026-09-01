import Product from "@/models/Product";
import dbConnect from "@/lib/mongodb";
import Link from "next/link";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import BulkDeleteTable from "@/components/admin/BulkDeleteTable";

export const dynamic = 'force-dynamic';

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload; 
  } catch (err) {
    return null;
  }
}

async function getProducts(userId, searchQuery) {
  await dbConnect();
  let query = { owner: userId };
  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ];
  }
  return await Product.find(query).sort({ createdAt: -1 });
}

export default async function TenantProductsPage({ searchParams }) {
  const user = await getUserPayload();
  if (!user || user.role !== 'tenant') return <div>Unauthorized</div>;

  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || '';
  const products = await getProducts(user.id, search);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Katalog Produk Saya</h1>
          <p className="mt-2 text-sm text-gray-700">
            Daftar semua produk dagangan yang Anda kelola di platform.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/tenant/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Tambah Produk
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="text-center bg-white rounded-lg border border-gray-200 py-12 px-4 shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada produk</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai unggah produk dagangan Anda sekarang.</p>
                <div className="mt-6">
                  <Link
                    href="/tenant/products/create"
                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                  >
                    Tambah Produk
                  </Link>
                </div>
              </div>
            ) : (
              <BulkDeleteTable products={JSON.parse(JSON.stringify(products))} userRole={user.role} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
