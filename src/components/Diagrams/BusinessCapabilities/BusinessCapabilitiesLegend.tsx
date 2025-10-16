import React from 'react';

const BusinessCapabilitiesLegend: React.FC = () => {
  const legendItems = [
    { color: '#3b82f6', label: 'L1 - Level 1 Capability', description: 'Top-level business capabilities' },
    { color: '#10b981', label: 'L2 - Level 2 Capability', description: 'Mid-level business capabilities' },
    { color: '#f59e0b', label: 'L3 - Level 3 Capability', description: 'Detailed business capabilities' },
    { color: '#ef4444', label: 'System', description: 'Individual systems' },
    { color: '#fbbf24', label: 'Search Match', description: 'Matched search results' },
    { color: '#fb923c', label: 'Search Path', description: 'Path to matched results' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-2 border-white"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-700">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Interactions</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li className="flex items-start">
            <svg className="w-3 h-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Click nodes to expand/collapse
          </li>
          <li className="flex items-start">
            <svg className="w-3 h-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Hover for details
          </li>
          <li className="flex items-start">
            <svg className="w-3 h-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Zoom with scroll wheel
          </li>
          <li className="flex items-start">
            <svg className="w-3 h-3 mr-1.5 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Pan by dragging background
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BusinessCapabilitiesLegend;
