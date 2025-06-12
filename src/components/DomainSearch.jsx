import React, { useState } from 'react';
import { Globe, Search, History } from 'lucide-react';
import { SearchBar } from './SearchBar/SearchBar';
import { SearchResult } from './SearchResult/SearchResult';
import { SearchHistory } from './SearchHistory/SearchHistory';
import { useDomainSearch } from '../hooks/useDomainSearch';
import { useSearchHistory } from '../hooks/useSearchHistory';

const DomainSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiSource, setApiSource] = useState('external');
  const [activeTab, setActiveTab] = useState('search');

  const { isLoading, error, searchResult, searchDomain, setError, setSearchResult } = useDomainSearch();
  const { searchHistory, loadHistory, deleteHistoryItem } = useSearchHistory();

  const handleSearch = async () => {
    try {
      await searchDomain(searchQuery.trim(), apiSource);
      await loadHistory();
    } catch (err) {
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLoadFromHistory = (historyItem) => {
    setSearchQuery(historyItem.domain);
    setSearchResult(historyItem.result);
    setApiSource(historyItem.apiSource || historyItem.api_source);
    setError(null);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Globe className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Domain Search
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-4">
            Search for domain information and availability
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'search'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Search className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Search</span>
              <span className="xs:hidden">Search</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <History className="w-4 h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">History ({searchHistory.length})</span>
              <span className="sm:hidden">History</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'search' ? (
            <>
              <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleSearch}
                apiSource={apiSource}
                onApiSourceChange={setApiSource}
                isLoading={isLoading}
                onKeyPress={handleKeyPress}
              />
              <SearchResult result={searchResult} error={error} />
            </>
          ) : (
            <SearchHistory
              history={searchHistory}
              onDeleteItem={deleteHistoryItem}
              onLoadFromHistory={handleLoadFromHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainSearch;