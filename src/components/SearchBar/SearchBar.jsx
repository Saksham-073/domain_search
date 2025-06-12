import React from 'react';
import { Radio, Clock } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  apiSource,
  onApiSourceChange,
  isLoading,
  onKeyPress,
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
          <Radio className="w-4 h-4 inline mr-2" />
          Search Method
        </label>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              value="external"
              checked={apiSource === "external"}
              onChange={(e) => onApiSourceChange(e.target.value)}
              className="mr-2 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700 text-sm sm:text-base">External API</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="internal"
              checked={apiSource === "internal"}
              onChange={(e) => onApiSourceChange(e.target.value)}
              className="mr-2 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700 text-sm sm:text-base">Internal API</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Enter domain name (e.g., example.com)"
            className="w-full px-3 sm:px-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base sm:text-lg"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="px-6 sm:px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium text-sm sm:text-base min-h-[48px] sm:min-h-[52px]"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span className="hidden sm:inline">Searching...</span>
              <span className="sm:hidden">Search...</span>
            </>
          ) : (
            <span>Search Domain</span>
          )}
        </button>
      </div>
    </div>
  );
}; 