import React from 'react';
import type { FilterState, Node, Link } from '../../../../types/diagrams';

interface OverallSystemsNewFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  originalNodes: Node[];
  originalLinks: Link[];
}

const OverallSystemsNewFilters: React.FC<OverallSystemsNewFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  originalNodes,
  originalLinks,
}) => {
  const systemTypes = ['All', ...new Set(originalNodes.map(n => n.type))];
  const connectionTypes = ['All', ...new Set(originalLinks.map(l => l.pattern))];
  const criticalities = ['All', ...new Set(originalNodes.map(n => n.criticality))];
  const frequencies = ['All', ...new Set(originalLinks.map(l => l.frequency))];

  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 self-start">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Filters</h2>

      <div className="space-y-6">
        {/* General Filters */}
        <div className="space-y-4">
          {/* System Search */}
          <div>
            <label
              htmlFor="system-search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by System Name/Code
            </label>
            <input
              type="text"
              id="system-search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.systemSearch}
              onChange={(e) => handleInputChange('systemSearch', e.target.value)}
              placeholder="Search systems..."
            />
          </div>

          {/* System Type Filter */}
          <div>
            <label
              htmlFor="system-type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              System Type
            </label>
            <select
              id="system-type-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.systemType}
              onChange={(e) => handleInputChange('systemType', e.target.value)}
            >
              {systemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Connection Type Filter */}
          <div className="hidden">
            <label
              htmlFor="connection-type-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Connection Type
            </label>
            <select
              id="connection-type-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.connectionType}
              onChange={(e) => handleInputChange('connectionType', e.target.value)}
            >
              {connectionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Criticality Filter */}
          <div>
            <label
              htmlFor="criticality-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Criticality
            </label>
            <select
              id="criticality-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.criticality}
              onChange={(e) => handleInputChange('criticality', e.target.value)}
            >
              {criticalities.map(crit => (
                <option key={crit} value={crit}>{crit}</option>
              ))}
            </select>
          </div>

          {/* Frequency Filter */}
          <div className="hidden">
            <label
              htmlFor="frequency-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Frequency
            </label>
            <select
              id="frequency-filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={filters.frequency}
              onChange={(e) => handleInputChange('frequency', e.target.value)}
            >
              {frequencies.map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-4 flex space-x-2">
          <button
            onClick={onApplyFilters}
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={onResetFilters}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverallSystemsNewFilters;
