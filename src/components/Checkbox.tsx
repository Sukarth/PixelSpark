import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  className,
  labelClassName,
  containerClassName,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {/* Inline animated tick CSS */}
      <style>{`
        .checkbox-tick {
          stroke-dasharray: 22;
          stroke-dashoffset: 22;
          opacity: 0;
          transition: stroke-dashoffset 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
        }
        .checkbox-checked .checkbox-tick {
          stroke-dashoffset: 0;
          opacity: 1;
        }
      `}</style>
      <label
        htmlFor={checkboxId}
        className={`flex items-center cursor-pointer group ${containerClassName || ''} ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          type="checkbox"
          id={checkboxId}
          className="sr-only peer" // Hide default checkbox
          {...props}
        />
        {/* Visual checkbox part */}
        <div
          className={`relative flex items-center justify-center w-5 h-5 border-2 border-gray-500 rounded 
                      peer-checked:bg-purple-600 peer-checked:border-purple-600 
                      transition-all duration-150 ease-in-out
                      group-hover:border-purple-400 peer-focus-visible:ring-1 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-gray-800 
                      ${className || ''}` + (props.checked ? ' checkbox-checked' : '')}
        >
          {/* Animated tick SVG */}
          <svg
            className={`w-3.5 h-3.5 text-white checkbox-tick`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <span className={`ml-2 text-sm text-gray-300 ${labelClassName || ''}`}>
            {label}
          </span>
        )}
      </label>
    </>
  );
};