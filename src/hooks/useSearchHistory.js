import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        credentials: 'include',
      });

      if (response.ok) {
        const history = await response.json();
        setSearchHistory(history);
      } else {
        const savedHistory = localStorage.getItem('domainSearchHistory');
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      }
    } catch (error) {
      console.warn('Error loading search history:', error);
      const savedHistory = localStorage.getItem('domainSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    }
  };

  const deleteHistoryItem = async (historyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${historyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete history item');
      }

      await loadHistory();
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    searchHistory,
    loadHistory,
    deleteHistoryItem,
  };
}; 