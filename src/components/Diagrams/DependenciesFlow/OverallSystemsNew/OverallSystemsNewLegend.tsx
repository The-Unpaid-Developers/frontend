import React from 'react';

const OverallSystemsNewLegend: React.FC = () => {
  const legendItems = [
    { color: '#ef4444', label: 'Major' },
    { color: '#f59e0b', label: 'Standard-1' },
    { color: '#22c55e', label: 'Standard-2' },
    { color: '#6b7280', label: 'N/A or Other' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mt-6">
      <h3 className="text-lg font-semibold mb-3 border-b pb-2">Nodes Legend (Criticality)</h3>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallSystemsNewLegend;
