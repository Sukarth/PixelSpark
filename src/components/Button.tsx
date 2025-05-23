
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  leftIcon,
  rightIcon,
  type = "button", // Default to "button"
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg focus:outline-none transition-all duration-150 ease-in-out inline-flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-purple-400 disabled:hover:bg-purple-400 disabled:opacity-60 disabled:cursor-not-allowed",
    secondary: "bg-gray-600 hover:bg-gray-700 text-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-red-400 disabled:hover:bg-red-400 disabled:opacity-60 disabled:cursor-not-allowed",
    ghost: "bg-transparent hover:bg-gray-700/70 text-gray-300 hover:text-white focus:bg-gray-700 focus:text-white disabled:text-gray-500 disabled:hover:bg-transparent disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type} // Explicitly set type
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${props.disabled ? 'disabled:opacity-60 disabled:cursor-not-allowed' : ''} ${className || ''}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 h-4 w-4 flex items-center justify-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 h-4 w-4 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
};
