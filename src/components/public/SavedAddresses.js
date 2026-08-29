import { useState, useEffect } from 'react';

export default function SavedAddresses({ addresses = [], onAddressAdded, onAddressDeleted }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan alamat');
      
      onAddressAdded(data.savedAddresses);
      setFormData({ label: '', name: '', phone: '', address: '', city: '', postalCode: '', notes: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus alamat ini?')) return;
    
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus alamat');
      
      onAddressDeleted(data.savedAddresses);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Alamat Tersimpan</h4>
          <p className="text-sm text-gray-500">Maksimal 5 alamat (untuk mempercepat proses checkout).</p>
        </div>
        {addresses.length < 5 && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            + Tambah Alamat
          </button>
        )}
      </div>

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-sm text-gray-500">Belum ada alamat tersimpan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm relative">
              <button type="button" onClick={() => handleDelete(addr._id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <h5 className="font-semibold text-gray-900 text-sm">{addr.label}</h5>
              <p className="font-medium text-gray-800 text-sm mt-1">{addr.name} ({addr.phone})</p>
              <p className="text-gray-500 text-xs mt-1">{addr.address}, {addr.city} {addr.postalCode}</p>
              {addr.notes && <p className="text-gray-400 text-xs mt-1 italic">"{addr.notes}"</p>}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
          <h5 className="text-sm font-medium text-gray-900 mb-4">Form Tambah Alamat</h5>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Label Alamat (mis. Rumah, Kost)</label>
              <input type="text" name="label" required value={formData.label} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Penerima</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nomor HP</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea name="address" required rows="2" value={formData.address} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kota / Kabupaten</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kode Pos (Opsional)</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Catatan (Patokan lokasi, opsional)</label>
              <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border" />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Batal</button>
            <button type="button" onClick={handleAdd} disabled={loading} className="px-3 py-1.5 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
