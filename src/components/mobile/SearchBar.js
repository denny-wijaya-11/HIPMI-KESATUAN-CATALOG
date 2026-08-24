'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const inputRef = useRef(null);

  const popularSearches = ['Keripik', 'Kopi', 'Kaos', 'Jasa Desain', 'Casing HP', 'Snack'];

  useEffect(() => {
    // Load history from local storage on mount
    const savedHistory = localStorage.getItem('hipmora_search_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    // Save to history
    let newHistory = [searchQuery, ...history.filter(item => item !== searchQuery)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('hipmora_search_history', JSON.stringify(newHistory));

    setIsFocused(false);
    inputRef.current?.blur();
    
    // Push to URL
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const removeHistoryItem = (itemToRemove, e) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item !== itemToRemove);
    setHistory(newHistory);
    localStorage.setItem('hipmora_search_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('hipmora_search_history');
  };

  return (
    <>
      <div className="relative w-full z-40 mb-6">
        <form onSubmit={onSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#C62828] focus:border-[#C62828] sm:text-sm transition-colors shadow-sm"
            placeholder="Cari produk di HIPMORA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {/* Full Screen Search Overlay for Mobile UX */}
      {isFocused && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
          {/* Header Overlay */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-white" style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}>
            <button 
              onClick={() => setIsFocused(false)}
              className="p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <form onSubmit={onSubmit} className="flex-1 relative">
              <input
                autoFocus
                type="text"
                className="w-full bg-gray-100 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-0 focus:outline-none"
                placeholder="Mau cari apa hari ini?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#FAFAF8]">
            {/* History Section */}
            {history.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-800">Pencarian Terakhir</h3>
                  <button onClick={clearHistory} className="text-xs font-semibold text-[#C62828]">Hapus Semua</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setQuery(item); handleSearch(item); }}
                      className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-600 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                      <button onClick={(e) => removeHistoryItem(item, e)} className="ml-1 text-gray-400 hover:text-gray-600 p-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3">Pencarian Populer</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(item); handleSearch(item); }}
                    className="flex items-center gap-1.5 bg-red-50 text-[#C62828] border border-red-100 rounded-full px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
