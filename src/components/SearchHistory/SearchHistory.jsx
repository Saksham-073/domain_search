import React from 'react';
import { Clock, Trash2, Server } from 'lucide-react';

export const SearchHistory = ({ history, onDeleteItem, onLoadFromHistory }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-3" />
        <p>No search history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onLoadFromHistory(item)}
              className="text-lg font-medium text-indigo-600 hover:text-indigo-700"
            >
              {item.domain}
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Server className="w-4 h-4 mr-1" />
                <span>{item.apiSource || item.api_source || 'Unknown'}</span>
              </div>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(item.searchDate || item.search_date)}</span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.result?.status?.toLowerCase() === 'available'
                    ? 'bg-green-100 text-green-700'
                    : item.result?.status?.toLowerCase() === 'unavailable'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {item.result?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 