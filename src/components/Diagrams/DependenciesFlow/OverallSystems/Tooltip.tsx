import React, { forwardRef } from 'react';

interface TooltipProps {}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute text-left p-2 text-xs bg-gray-800 text-white border-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-200 z-10"
      style={{ maxWidth: '300px' }}
    />
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;