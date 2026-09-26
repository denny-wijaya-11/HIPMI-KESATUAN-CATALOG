'use client';

import { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'Menunggu Pembayaran', label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-800' },
  { value: 'Diproses', label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  { value: 'Dikirim', label: 'Dikirim', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-green-100 text-green-800' },
  { value: 'Dibatalkan', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
];

const getStatusColor = (status) => {
  const option = STATUS_OPTIONS.find(o => o.value === status);
  return option ? option.color : 'bg-gray-100 text-gray-800';
};

const formatPrice = (price) => {
  return price ? `Rp ${Number(price).toLocaleString('id-ID')}` : 'Rp 0';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function TenantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mobile action sheet state
  const [actionSheet, setActionSheet] = useState(null); // { orderId, currentStatus }
  const [buyerExpanded, setBuyerExpanded] = useState(null); // orderId

  async function fetchOrders() {
    try {
      const res = await fetch('/api/tenant/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil pesanan');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(`/api/tenant/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      setActionSheet(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const openActionSheet = (orderId, currentStatus) => {
    setActionSheet({ orderId, currentStatus });
  };

  const closeActionSheet = () => {
    setActionSheet(null);
  };

  const toggleBuyerExpand = (orderId) => {
    setBuyerExpanded(prev => prev === orderId ? null : orderId);
  };

  if (isLoading) return <div className="p-8 text-center">Memuat pesanan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order._id} className="p-4 bg-white">
                  {/* Header: Order ID + Date + Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Buyer Info - Expandable */}
                  <div className="mb-3">
                    <button
                      onClick={() => toggleBuyerExpand(order._id)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-left transition-colors hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-medium text-sm">
                            {order.shippingAddress?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{order.shippingAddress?.name}</p>
                          <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                        </div>
                      </div>
                      <span className="text-gray-400">
                        {buyerExpanded === order._id ? '▲' : '▼'}
                      </span>
                    </button>
                    
                    {buyerExpanded === order._id && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                        <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        {order.shippingAddress?.postalCode && <p>Kode Pos: {order.shippingAddress.postalCode}</p>}
                        {order.shippingAddress?.notes && <p>Catatan: {order.shippingAddress.notes}</p>}
                      </div>
                    )}
                  </div>

                  {/* Products - Chips */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Produk:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700"
                          title={item.product?.name}
                        >
                          {item.product?.name || 'Produk dihapus'} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Total + Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-200">
                    <div className="font-semibold text-gray-900 text-lg">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => openActionSheet(order._id, order.status)}
                        className="flex-1 sm:w-auto px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Ubah Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembeli & Alamat</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-6).toUpperCase()}
                        <div className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="font-medium text-gray-900">{order.shippingAddress?.name}</div>
                        <div className="text-xs mt-1">{order.shippingAddress?.phone}</div>
                        <div className="text-xs mt-1 truncate" title={order.shippingAddress?.address}>
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700"
                              title={item.product?.name}
                            >
                              {item.product?.name || 'Produk dihapus'} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Mobile Action Sheet Modal */}
      {actionSheet && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={closeActionSheet}>
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ubah Status Pesanan</h3>
              <button onClick={closeActionSheet} className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Pesanan #{actionSheet.orderId.slice(-6).toUpperCase()}</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(actionSheet.orderId, opt.value)}
                  disabled={opt.value === actionSheet.currentStatus}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${opt.value === actionSheet.currentStatus 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : `bg-white border-2 border-gray-200 hover:border-red-500 hover:text-red-600 ${opt.color.replace('bg-', 'text-').replace('text-', 'border-')}`}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
