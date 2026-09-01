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
    image: '',
    images: [],
    variants: []
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    if (formData.images.length + files.length > 5) {
      alert("Maksimal 5 gambar diperbolehkan");
      return;
    }
    
    setLoading(true);
    const uploadedUrls = [...formData.images];
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) throw new Error("API Key ImgBB (NEXT_PUBLIC_IMGBB_API_KEY) belum dikonfigurasi di Environment Variables.");

      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: uploadData
        });
        const json = await res.json();
        if (json.success) {
          uploadedUrls.push(json.data.url);
        } else {
          throw new Error("Gagal mengupload gambar ke ImgBB");
        }
      }
      
      setFormData({ ...formData, images: uploadedUrls, image: uploadedUrls[0] || '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages, image: newImages[0] || '' });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', additionalPrice: '' }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/tenant/products/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat produk');
        }
        
        let productImages = data.product.images || [];
        if (productImages.length === 0 && data.product.image) {
          productImages = [data.product.image];
        }

        setFormData({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          category: data.product.category,
          region: data.product.region || 'Kota Bogor',
          image: data.product.image || '',
          images: productImages,
          variants: data.product.variants || []
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
      if (formData.images.length === 0) {
        throw new Error('Minimal 1 gambar produk harus diupload.');
      }

      const res = await fetch(`/api/tenant/products/${id}`, {
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
        router.push('/tenant/products');
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
            href="/tenant/products"
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

            <div className="sm:col-span-6 border-t border-gray-900/10 pt-6 mt-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Gambar Produk (Maksimal 5) <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="mt-2 flex flex-wrap gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 cursor-pointer bg-gray-50">
                    <span className="text-2xl leading-none">{loading ? '⌛' : '+'}</span>
                    <span className="text-xs mt-1 text-center px-1">{loading ? 'Mengunggah...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Upload hingga 5 gambar produk. Disarankan rasio persegi (1:1). Gambar pertama akan menjadi thumbnail.
              </p>
            </div>

            <div className="sm:col-span-6 border-t border-gray-900/10 pt-6 mt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Variasi/Jenis Produk (Opsional)
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-red-600 font-semibold hover:text-red-500"
                >
                  + Tambah Variasi
                </button>
              </div>
              <p className="mb-4 text-xs text-gray-500">Gunakan ini jika produk Anda memiliki ukuran/warna berbeda dengan harga tambahan.</p>
              
              <div className="space-y-3">
                {formData.variants.map((variant, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border">
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        value={variant.name}
                        onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                        placeholder="Contoh: Ukuran XL"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                      />
                    </div>
                    <div className="w-1/3">
                      <input
                        type="number"
                        min="0"
                        value={variant.additionalPrice}
                        onChange={(e) => handleVariantChange(idx, 'additionalPrice', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Tambahan Harga (Opsional)"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 px-3"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-500 hover:text-red-700 font-bold text-xl px-2"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {formData.variants.length === 0 && (
                  <div className="text-sm text-gray-400 italic">Belum ada variasi.</div>
                )}
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
