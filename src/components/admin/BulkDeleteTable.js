'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import ToggleFeaturedButton from '@/components/admin/ToggleFeaturedButton';

export default function BulkDeleteTable({ products, userRole }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih secara permanen?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds: selectedIds })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus produk');
      }

      alert(`${selectedIds.length} produk berhasil dihapus`);
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col">
      {userRole !== 'operator' && selectedIds.length > 0 && (
        <div className="mb-4 flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="text-sm font-medium text-red-800">
            {selectedIds.length} produk terpilih
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Terpilih'}
          </button>
        </div>
      )}

      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {userRole !== 'operator' && (
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                        checked={selectedIds.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Produk
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Kategori
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Harga
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Unggulan
                  </th>
                  {userRole !== 'operator' && (
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
                {products.map((product) => {
                  const isSelected = selectedIds.includes(product._id);
                  return (
                    <tr key={product._id} className={isSelected ? 'bg-red-50' : undefined}>
                      {userRole !== 'operator' && (
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {isSelected && <div className="absolute inset-y-0 left-0 w-0.5 bg-red-600" />}
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            value={product._id}
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(e, product._id)}
                          />
                        </td>
                      )}
                      <td className={`whitespace-nowrap py-4 pr-3 text-sm ${userRole !== 'operator' ? 'pl-4 sm:pl-6' : 'pl-4 sm:pl-6'}`}>
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded bg-gray-100 overflow-hidden border border-gray-200">
                            <Image 
                              src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                              alt={product.name || 'Product'} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 truncate max-w-[200px]">{product.name || 'Produk Tanpa Nama'}</div>
                            <div className="text-gray-500 text-xs truncate max-w-[200px]">{product.description || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          {product.category || 'Lainnya'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                        Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        {userRole === 'operator' ? (
                          product.isFeatured ? (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                              Ya
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-500">
                              Tidak
                            </span>
                          )
                        ) : (
                          <ToggleFeaturedButton productId={product._id} initialIsFeatured={product.isFeatured} />
                        )}
                      </td>
                      {userRole !== 'operator' && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product.owner?.name || 'Unknown'}
                        </td>
                      )}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-3">
                          <Link href={`/admin/products/${product._id}/edit`} className="text-red-600 hover:text-red-900">
                            Edit
                          </Link>
                          {userRole !== 'operator' && (
                            <DeleteProductButton productId={product._id} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
