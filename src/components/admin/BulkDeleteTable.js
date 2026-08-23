'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DeleteProductButton from '@/components/admin/DeleteProductButton';
import ToggleFeaturedButton from '@/components/admin/ToggleFeaturedButton';
import ToggleHiddenButton from '@/components/admin/ToggleHiddenButton';

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

  const handleBulkHide = async (isHidden) => {
    const actionText = isHidden ? 'menyembunyikan' : 'menampilkan';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionText} ${selectedIds.length} produk yang dipilih?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/products/bulk-hide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productIds: selectedIds, isHidden })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Gagal ${actionText} produk`);
      }

      alert(`${selectedIds.length} produk berhasil di${isHidden ? 'sembunyikan' : 'tampilkan'}`);
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
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-red-50 p-4 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="text-sm font-medium text-red-800">
            {selectedIds.length} produk terpilih
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkHide(false)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Tampilkan
            </button>
            <button
              onClick={() => handleBulkHide(true)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              Sembunyikan
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {userRole !== 'operator' && (
                    <th scope="col" className="relative px-2 sm:px-6 sm:w-12">
                      <input
                        type="checkbox"
                        className="absolute left-2 sm:left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                        checked={selectedIds.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th scope="col" className="py-3.5 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Produk
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Kategori
                  </th>
                  <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Region
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Harga
                  </th>
                  <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Unggulan
                  </th>
                  {userRole !== 'operator' && (
                    <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pemilik (UKM)
                    </th>
                  )}
                  <th scope="col" className="relative py-3.5 pl-1 pr-2 sm:pr-6 w-16">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => {
                  const isSelected = selectedIds.includes(product._id);
                  return (
                    <tr key={product._id} className={`${isSelected ? 'bg-red-50' : ''} ${product.isHidden ? 'opacity-60 bg-gray-50' : ''}`}>
                      {userRole !== 'operator' && (
                        <td className="relative px-2 sm:px-6 sm:w-12">
                          {isSelected && <div className="absolute inset-y-0 left-0 w-0.5 bg-red-600" />}
                          <input
                            type="checkbox"
                            className="absolute left-2 sm:left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            value={product._id}
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(e, product._id)}
                          />
                        </td>
                      )}
                      <td className={`whitespace-nowrap py-3 sm:py-4 pr-1 sm:pr-3 text-sm pl-0 sm:pl-6`}>
                        <div className="flex items-center">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 relative rounded bg-gray-100 overflow-hidden border border-gray-200">
                            <Image 
                              src={product.image && product.image.startsWith('http') ? product.image : '/images/placeholder.png'} 
                              alt={product.name || 'Product'} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-2 sm:ml-4 flex-1 min-w-0 max-w-[110px] sm:max-w-xs">
                            <div className="font-semibold sm:font-medium text-gray-900 truncate text-[12px] sm:text-sm">{product.name || 'Produk Tanpa Nama'}</div>
                            
                            {/* Mobile info */}
                            <div className="sm:hidden mt-0 flex flex-col">
                              <span className="text-gray-900 font-bold text-[10px]">Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
                              <span className="text-gray-500 text-[9px] truncate">{product.category || 'Lainnya'}</span>
                            </div>

                            {/* Desktop info */}
                            <div className="hidden sm:block text-gray-500 text-xs truncate">{product.description || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                          {product.category || 'Lainnya'}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.region || '-'}
                      </td>
                      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                        Rp {product.price ? Number(product.price).toLocaleString('id-ID') : '0'}
                      </td>
                      <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-center">
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
                        <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product.owner?.name || 'Unknown'}
                        </td>
                      )}
                      <td className="relative whitespace-nowrap py-3 sm:py-4 pl-0 pr-2 sm:pr-6 text-right text-sm font-medium">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5 sm:gap-3">
                          <div className="flex items-center gap-1 sm:gap-3">
                            <ToggleHiddenButton productId={product._id} initialIsHidden={product.isHidden} />
                            <Link href={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-900 text-[10px] sm:text-xs bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold border border-blue-100">
                              Edit
                            </Link>
                          </div>
                          {userRole !== 'operator' && (
                            <div className="sm:scale-100 origin-right text-[10px] sm:text-sm">
                              <DeleteProductButton productId={product._id} />
                            </div>
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
