import Product from "@/models/Product";
import User from "@/models/User";
import mongoose from "mongoose";
import Link from "next/link";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Image from "next/image";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

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

async function getProducts(user) {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  
  let query = {};
  if (user.role === 'operator') {
    query = { owner: user.userId };
  }

  const products = await Product.find(query)
    .populate('owner', 'name')
    .sort({ createdAt: -1 });
    
  return products;
}

export default async function ProductsPage() {
  const user = await getUserPayload();
  if (!user) return <div>Unauthorized</div>;

  const products = await getProducts(user);

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
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Produk
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Kategori
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Harga
                      </th>
                      {user.role !== 'operator' && (
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Pemilik (UKM)
                        </th>
                      )}
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {products.map((product) => (
                      <tr key={product._id.toString()}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 relative rounded bg-gray-100 overflow-hidden border border-gray-200">
                              <Image 
                                src={product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                                alt={product.name} 
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</div>
                              <div className="text-gray-500 text-xs truncate max-w-[200px]">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                          Rp {product.price.toLocaleString('id-ID')}
                        </td>
                        {user.role !== 'operator' && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {product.owner?.name || 'Unknown'}
                          </td>
                        )}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-3">
                            <Link href={`/admin/products/${product._id.toString()}/edit`} className="text-red-600 hover:text-red-900">
                              Edit
                            </Link>
                            {user.role !== 'operator' && (
                              <DeleteProductButton productId={product._id.toString()} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
