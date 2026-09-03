'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
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
            type="search"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#C62828] focus:border-[#C62828] sm:text-sm transition-colors shadow-sm"
            placeholder="Cari produk di HIPMORA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
    </>
  );
}
