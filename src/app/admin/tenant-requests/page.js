'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TenantRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/tenant-requests');
      if (!res.ok) throw new Error('Gagal mengambil data pengajuan');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    if (!confirm(`Apakah Anda yakin ingin me-${action === 'approve' ? 'nerima' : 'nolak'} pengajuan ini?`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/tenant-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Terjadi kesalahan');
      }
      
      // Remove from list on success
      setRequests(requests.filter(req => req._id !== userId));
      alert(`Pengajuan berhasil di${action === 'approve' ? 'terima' : 'tolak'}.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Persetujuan Tenant</h1>
          <p className="mt-2 text-sm text-gray-700">
            Daftar mahasiswa yang mengajukan diri untuk menjadi penjual (Tenant) di HIPMORA.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pengajuan</h3>
            <p className="mt-1 text-sm text-gray-500">Saat ini tidak ada mahasiswa yang sedang mengajukan diri.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests.map((request) => (
              <li key={request._id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-red-600 truncate">{request.name}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 flex flex-col gap-1">
                        <p>📧 {request.email}</p>
                        <p>📱 {request.whatsapp}</p>
                        <p>🎓 {request.university}</p>
                        <p>📍 {request.address || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-4">
                      <h4 className="text-xs font-bold text-gray-900 uppercase mb-2">Metode Pembayaran ({request.paymentMethods?.length || 0})</h4>
                      <div className="text-sm text-gray-500 space-y-2">
                        {request.paymentMethods?.map((pm, idx) => (
                          <div key={idx} className="bg-gray-50 p-2 rounded border border-gray-200">
                            <span className="font-medium text-gray-900">{pm.provider}</span>: {pm.accountNumber} (a/n {pm.accountName})
                            {pm.qrisImage && (
                              <a href={pm.qrisImage} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline mt-1">
                                Lihat QRIS
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleAction(request._id, 'approve')}
                        disabled={actionLoading === request._id}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {actionLoading === request._id ? 'Memproses...' : 'Terima'}
                      </button>
                      <button
                        onClick={() => handleAction(request._id, 'reject')}
                        disabled={actionLoading === request._id}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {actionLoading === request._id ? 'Memproses...' : 'Tolak'}
                      </button>
                    </div>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
