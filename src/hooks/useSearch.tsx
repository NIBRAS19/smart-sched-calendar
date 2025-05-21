
import { useState, useEffect } from 'react';

interface SearchOptions<T> {
  items: T[];
  searchFields: (keyof T)[];
  initialQuery?: string;
}

export function useSearch<T>({ 
  items, 
  searchFields,
  initialQuery = ''
}: SearchOptions<T>) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(items);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const lowerCaseQuery = query.toLowerCase();
    const filtered = items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseQuery);
        }
        return false;
      });
    });

    setResults(filtered);
    setIsSearching(false);
  }, [query, items, searchFields]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasResults: results.length > 0,
    resultsCount: results.length
  };
}
