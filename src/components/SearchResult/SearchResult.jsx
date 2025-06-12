import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Server } from 'lucide-react';

export const SearchResult = ({ result, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center text-red-700">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'text-green-600';
      case 'unavailable':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'unavailable':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Server className="w-4 h-4 mr-1" />
          <span>{result.source || 'Unknown'} API</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Status:</span>
            <span className={`font-medium ${getStatusColor(result.status)}`}>
              {result.status || 'Unknown'}
            </span>
          </div>
          {getStatusIcon(result.status)}
        </div>

        {result.registrar && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Registrar</h4>
            <p className="text-gray-800">{result.registrar}</p>
          </div>
        )}

        {result.creationDate && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Creation Date</h4>
            <p className="text-gray-800">
              {new Date(result.creationDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {result.expiryDate && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Expiry Date</h4>
            <p className="text-gray-800">
              {new Date(result.expiryDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {result.nameServers && result.nameServers.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Name Servers</h4>
            <ul className="space-y-1">
              {result.nameServers.map((ns, index) => (
                <li key={index} className="text-gray-800">{ns}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 