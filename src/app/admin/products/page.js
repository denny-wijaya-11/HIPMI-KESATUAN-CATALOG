import Product from "@/models/Product";
import User from "@/models/User";
import mongoose from "mongoose";
import Link from "next/link";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Image from "next/image";
import BulkDeleteTable from "@/components/admin/BulkDeleteTable";
import AdminProductFilter from "@/components/admin/AdminProductFilter";

export const dynamic = 'force-dynamic';

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, email, role }
  } catch (err) {
    return null;
  }
}

async function getProducts(user, search, region, sort) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  
  let query = {};
  if (user.role === 'operator') {
    const operatorDetails = await User.findById(user.id);
    if (operatorDetails) {
      if (operatorDetails.isStudent) {
        query.university = operatorDetails.university;
      } else {
        query.address = operatorDetails.address;
      }
    }
  } else if (user.role === 'tenant') {
    query.owner = user.id;
  }
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (region && region !== 'Semua') {
    query.region = region;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  const products = await Product.find(query)
    .populate('owner', 'name')
    .sort(sortOption);
    
  return products;
}

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || '';
  const region = resolvedParams?.region || 'Semua';
  const sort = resolvedParams?.sort || 'newest';
  
  const user = await getUserPayload();
  if (!user) return <div>Unauthorized</div>;

  const products = await getProducts(user, search, region, sort);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Katalog Produk</h1>
          <p className="mt-2 text-sm text-gray-700">
            {user.role === 'operator' 
              ? 'Daftar semua produk yang Anda miliki di katalog.' 
              : 'Daftar seluruh produk dari semua UKM yang terdaftar di sistem.'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Tambah Produk
          </Link>
        </div>
      </div>
      
      <AdminProductFilter />
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {products.length === 0 ? (
              <div className="text-center bg-white rounded-lg border border-gray-200 py-12 px-4 shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada produk</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai unggah produk dagangan Anda ke katalog.</p>
                <div className="mt-6">
                  <Link
                    href="/admin/products/create"
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
