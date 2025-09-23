import React from 'react';

export interface DropDownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropDownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options?: DropDownOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  id?: string;
  className?: string;
}

export const DropDown = React.forwardRef<HTMLSelectElement, DropDownProps>(
  (
    {
      options = [],
      label,
      placeholder,
      error,
      helpText,
      id,
      className = '',
      value,
      ...rest
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            value={value}
            className={`
              block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white
              placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500
              appearance-none
              ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map(o => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          {/* custom arrow */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
            ▼
          </span>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

DropDown.displayName = 'DropDown';