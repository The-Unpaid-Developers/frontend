import React from 'react';
import type { FilterState, Node, Link } from '../../../../types/diagrams';

interface OverallSystemsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  originalNodes: Node[];
  originalLinks: Link[];
}

const OverallSystemsFilters: React.FC<OverallSystemsFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  originalNodes,
  originalLinks,
}) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Get unique values for filter options
  const systemTypes = ['All', ...new Set(originalNodes.map(n => n.type))];
  const connectionTypes = ['All', ...new Set(originalLinks.map(l => l.pattern))];
  const criticalities = ['All', ...new Set(originalNodes.map(n => n.criticality))];
  const frequencies = ['All', ...new Set(originalLinks.map(l => l.frequency))];

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 self-start">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Filters</h2>

      <div className="space-y-6">
        {/* General Filters */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by System Name/Code
            </label>
            <input
              type="text"
              value={filters.systemSearch}
              onChange={(e) => updateFilter('systemSearch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search systems..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Type
            </label>
            <select
              value={filters.systemType}
              onChange={(e) => updateFilter('systemType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {systemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Criticality
            </label>
            <select
              value={filters.criticality}
              onChange={(e) => updateFilter('criticality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {criticalities.map(criticality => (
                <option key={criticality} value={criticality}>{criticality}</option>
              ))}
            </select>
          </div>

          {/* Hidden in original HTML but keeping structure */}
          <div className="hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection Type
            </label>
            <select
              value={filters.connectionType}
              onChange={(e) => updateFilter('connectionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              {connectionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={filters.frequency}
              onChange={(e) => updateFilter('frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              {frequencies.map(frequency => (
                <option key={frequency} value={frequency}>{frequency}</option>
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

export default OverallSystemsFilters;