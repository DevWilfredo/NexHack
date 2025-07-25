// components/SearchBar.jsx
import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { UserSearch } from "lucide-react";

const SearchBar = ({ onSearch, placeholder = "Buscar...", spacing }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useDebounce(
    () => {
      setDebouncedQuery(query);
    },
    500,
    [query]
  );

  // Ejecutar búsqueda cuando cambia debouncedQuery
  useEffect(() => {
    onSearch(debouncedQuery.trim());
  }, [debouncedQuery, onSearch]);

  return (
    <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-box  ">
      <UserSearch className="text-gray-400 w-8 h-8" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`input input-${spacing} bg-base-300  w-full focus:scale-105
         transition-all bordered-none"`}
      />
    </div>
  );
};

export default SearchBar;
