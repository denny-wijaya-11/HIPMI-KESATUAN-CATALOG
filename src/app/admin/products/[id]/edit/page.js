'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Lainnya',
    region: 'Kota Bogor',
    image: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat produk');
        }
        
        setFormData({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          category: data.product.category,
          region: data.product.region || 'Kota Bogor',
          image: data.product.image || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah produk');
      }

      setSuccess('Produk berhasil diperbarui!');
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Memuat data produk...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Produk
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/admin/products"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Batal
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Nama Produk
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                Harga (Rp)
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                Kategori
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Perlengkapan">Perlengkapan</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                Wilayah Pengiriman (Region)
              </label>
              <div className="mt-2">
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                >
                  <optgroup label="JABODETABEK">
                    <option value="Jakarta">Jakarta</option>
                    <option value="Kota Bogor">Kota Bogor</option>
                    <option value="Kab. Bogor">Kab. Bogor</option>
                    <option value="Kota Depok">Kota Depok</option>
                    <option value="Kota Tangerang">Kota Tangerang</option>
                    <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                    <option value="Kab. Tangerang">Kab. Tangerang</option>
                    <option value="Kota Bekasi">Kota Bekasi</option>
                    <option value="Kab. Bekasi">Kab. Bekasi</option>
                  </optgroup>
                  <optgroup label="Jawa Barat">
                    <option value="Kota Bandung">Kota Bandung</option>
                    <option value="Kab. Bandung">Kab. Bandung</option>
                    <option value="Kab. Bandung Barat">Kab. Bandung Barat</option>
                    <option value="Kota Cimahi">Kota Cimahi</option>
                    <option value="Kota Sukabumi">Kota Sukabumi</option>
                    <option value="Kab. Sukabumi">Kab. Sukabumi</option>
                    <option value="Kota Cirebon">Kota Cirebon</option>
                    <option value="Kab. Cirebon">Kab. Cirebon</option>
                    <option value="Kota Tasikmalaya">Kota Tasikmalaya</option>
                    <option value="Kab. Tasikmalaya">Kab. Tasikmalaya</option>
                    <option value="Kota Banjar">Kota Banjar</option>
                    <option value="Kab. Ciamis">Kab. Ciamis</option>
                    <option value="Kab. Cianjur">Kab. Cianjur</option>
                    <option value="Kab. Garut">Kab. Garut</option>
                    <option value="Kab. Indramayu">Kab. Indramayu</option>
                    <option value="Kab. Karawang">Kab. Karawang</option>
                    <option value="Kab. Kuningan">Kab. Kuningan</option>
                    <option value="Kab. Majalengka">Kab. Majalengka</option>
                    <option value="Kab. Pangandaran">Kab. Pangandaran</option>
                    <option value="Kab. Purwakarta">Kab. Purwakarta</option>
                    <option value="Kab. Subang">Kab. Subang</option>
                    <option value="Kab. Sumedang">Kab. Sumedang</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                URL Gambar (Opsional)
              </label>
              <div className="mt-2">
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Deskripsi Produk
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

          </div>
        </div>
        
        {error && (
          <div className="px-4 sm:px-8 py-3 bg-red-50 text-red-700 text-sm border-t border-red-100">
            {error}
          </div>
        )}
        
        {success && (
          <div className="px-4 sm:px-8 py-3 bg-green-50 text-green-700 text-sm border-t border-green-100">
            {success}
          </div>
        )}

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
