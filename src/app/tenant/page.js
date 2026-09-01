'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('@/components/tenant/DashboardCharts'), { ssr: false });

export default function TenantDashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    salesChart: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/tenant/dashboard');
        if (!res.ok) throw new Error('Gagal mengambil data analitik');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Penjual</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 transition hover:shadow-md">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Produk</dt>
                  <dd className="text-xl sm:text-2xl font-semibold text-gray-900">{metrics.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 transition hover:shadow-md">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Pesanan</dt>
                  <dd className="text-xl sm:text-2xl font-semibold text-gray-900">{metrics.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 transition hover:shadow-md">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Pendapatan</dt>
                  <dd className="text-base sm:text-lg font-semibold text-gray-900 truncate">Rp {metrics.totalRevenue.toLocaleString('id-ID')}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 transition hover:shadow-md">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-md p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Menunggu Diproses</dt>
                  <dd className="text-xl sm:text-2xl font-semibold text-gray-900">{metrics.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <DashboardCharts metrics={metrics} />
    </div>
  );
}
