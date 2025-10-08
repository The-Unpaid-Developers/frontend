import React from 'react';
import type { LegendItem } from '../../../../types/diagrams';

const SankeyLegend: React.FC = () => {
  const nodesLegend: LegendItem[] = [
    { color: '#ef4444', label: 'Major' },
    { color: '#f59e0b', label: 'Standard-1' },
    { color: '#22c55e', label: 'Standard-2' },
    { color: '#6b7280', label: 'N/A or Other' },
  ];

  const linksLegend: LegendItem[] = [
    { color: '#1f77b4', label: 'Web Service' },
    { color: '#9467bd', label: 'API' },
    { color: '#2ca02c', label: 'Batch' },
    { color: '#ff7f0e', label: 'File' },
    { color: '#6b7280', label: 'N/A or Other' },
  ];

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Nodes Legend (Criticality)</h3>
      <div className="space-y-2 mb-6">
        {nodesLegend.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">Links Legend (Integration Pattern)</h3>
      <div className="space-y-2">
        {linksLegend.map((item, index) => (
          <div key={index} className="flex items-center">
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

export default SankeyLegend;