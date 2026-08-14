'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChatIcon() {
  const pathname = usePathname();
  const isActive = pathname.startsWith('/chat');

  return (
    <div className="relative">
      <Link 
        href="/chat"
        className={`relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center ${
          isActive 
            ? 'text-white bg-white/20' 
            : 'text-neutral-400 hover:text-white hover:bg-white/10'
        }`}
        title="Pesan Masuk"
      >
        <span className="sr-only">Pesan Masuk</span>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </Link>
    </div>
  );
}
