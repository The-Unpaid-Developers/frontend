import React from 'react';

interface TooltipProps {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

const PathsTooltip: React.FC<TooltipProps> = ({ visible, x, y, content }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-10 pointer-events-none"
      style={{
        left: `${x + 15}px`,
        top: `${y - 28}px`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <div className="bg-gray-800 text-white text-xs p-2 rounded-lg border-0">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default PathsTooltip;