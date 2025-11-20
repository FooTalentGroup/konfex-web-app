'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  loadingText,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#8B709D',
          color: '#FEFCFF',
        };
      case 'secondary':
        return {
          backgroundColor: '#6A5379',
          color: '#FEFCFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#8B709D',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#8B709D',
        };
      default:
        return {
          backgroundColor: '#8B709D',
          color: '#FEFCFF',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#8B709D] focus:ring-offset-2 transition-opacity w-full disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        height: '42px',
        borderRadius: '8px',
        padding: '10px 16px',
        fontFamily: 'var(--font-lato), sans-serif',
        fontWeight: 400,
        fontSize: 'clamp(14px, 3.5vw, 16px)',
        lineHeight: '131%',
        letterSpacing: '0%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...variantStyles,
      }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || 'Cargando...'}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

