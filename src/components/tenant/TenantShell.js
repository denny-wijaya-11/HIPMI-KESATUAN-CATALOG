'use client';

import { useState, Suspense } from 'react';
import TenantSidebar from './TenantSidebar';
import TenantHeader from './TenantHeader';

export default function TenantShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      <TenantSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200"></div>}>
          <TenantHeader setIsSidebarOpen={setIsSidebarOpen} />
        </Suspense>
        <main className="flex-1 overflow-x-hidden">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
