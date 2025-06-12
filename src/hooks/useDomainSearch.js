import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useDomainSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const validateDomain = (domain) => {
    if (!domain.trim()) {
      throw new Error('Please enter a domain name');
    }

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$|^[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      throw new Error('Please enter a valid domain name (e.g., example.com)');
    }
  };

  const searchDomain = async (domain, source) => {
    try {
      setIsLoading(true);
      setError(null);
      setSearchResult(null);

      validateDomain(domain);

      const response = await fetch(
        `${API_BASE_URL}/domain/search?domain=${encodeURIComponent(domain)}&source=${source}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSearchResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    searchResult,
    searchDomain,
    setError,
    setSearchResult,
  };
}; 