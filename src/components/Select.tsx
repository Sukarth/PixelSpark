
import React from 'react';
import { ChevronDownIcon } from './Icons';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  id,
  className,
  labelClassName,
  containerClassName,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={`w-full ${containerClassName || ''}`}>
      {label && (
        <label htmlFor={selectId} className={`block text-sm font-medium text-gray-300 mb-1 ${labelClassName || ''}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`block w-full pl-3 pr-10 py-2.5 text-base border-gray-600 bg-gray-700 text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                     rounded-md appearance-none shadow-sm
                     disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                     ${className || ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-700 text-gray-100">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
