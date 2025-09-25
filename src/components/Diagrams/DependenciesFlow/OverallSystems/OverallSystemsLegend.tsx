import React from 'react';

const OverallSystemsLegend: React.FC = () => {
  const criticalities = [
    { color: "#ef4444", label: "Major" },
    { color: "#f59e0b", label: "Standard-1" },
    { color: "#22c55e", label: "Standard-2" },
    { color: "#6b7280", label: "N/A or Other" }
  ];

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-5">
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Nodes Legend (Criticality)</h3>
        <div className="space-y-2">
          {criticalities.map(({ color, label }) => (
            <div key={label} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverallSystemsLegend;