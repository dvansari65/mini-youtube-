import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search-result?q=${encodeURIComponent(query.trim())}`, { replace: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-xl mx-auto">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        type="text"
        id="search"
        placeholder="Search videos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        aria-label="Search"
      >
        🔍
      </button>
    </form>
  );
}

export default SearchBar;