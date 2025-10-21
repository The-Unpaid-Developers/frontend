import React from 'react';

interface BusinessCapabilitiesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  matchCount?: number;
}

const BusinessCapabilitiesSearch: React.FC<BusinessCapabilitiesSearchProps> = ({
  searchTerm,
  onSearchChange,
  matchCount = 0
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Business Capabilities
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by capability name..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Found <span className="font-semibold text-blue-600">{matchCount}</span> matching capabilities
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Click on nodes to expand/collapse branches. Search will automatically expand the tree to show matching results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessCapabilitiesSearch;
