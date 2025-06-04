import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search-result?q=${encodeURIComponent(query.trim())}`);
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 max-w-xl mx-auto">
      <label htmlFor="search"></label>
      <input
        type="text"
        id='search'
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
      >
        🔍
      </button>
    </form>
  );
}

export default SearchBar;