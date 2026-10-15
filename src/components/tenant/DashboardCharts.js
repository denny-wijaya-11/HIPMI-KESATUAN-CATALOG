"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function DashboardCharts({ metrics }) {
  if (!metrics || !metrics.salesChart || metrics.salesChart.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-6 sm:mt-8">
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Pendapatan 7 Hari Terakhir</h3>
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.salesChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 10, dy: 4}} 
                interval={metrics.salesChart.length > 5 ? 'preserveStartEnd' : 0}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 10}} 
                tickFormatter={(value) => value >= 1000 ? `Rp${value/1000}k` : `Rp${value}`}
                tickCount={4}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Pesanan 7 Hari Terakhir</h3>
        <div className="h-56 sm:h-64 md:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.salesChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 10, dy: 4}}
                interval={metrics.salesChart.length > 5 ? 'preserveStartEnd' : 0}
              />
              <YAxis 
                allowDecimals={false} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 10}} 
                tickCount={4}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                formatter={(value) => [`${value} Pesanan`, 'Total']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                cursor={{fill: '#f3f4f6'}}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
