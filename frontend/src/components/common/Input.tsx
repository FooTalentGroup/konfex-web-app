'use client';

import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  register,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-2 w-full"
          style={{
            minHeight: '24px',
            fontFamily: 'var(--font-lato), sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(16px, 4vw, 18px)',
            lineHeight: '131%',
            letterSpacing: '0%',
            color: hasError ? '#D9537A' : '#1A151E',
          }}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          {...props}
          {...register}
          type={inputType}
          className={`focus:outline-none w-full ${className}`}
          style={{
            height: '48px',
            borderRadius: '6px',
            borderWidth: hasError ? '2px' : '1px',
            borderStyle: 'solid',
            borderColor: hasError ? '#D9537A' : '#6A5379',
            padding: '12px',
            paddingRight: isPassword && showPasswordToggle ? '48px' : '12px',
            backgroundColor: '#FEFCFF',
            color: '#1A151E',
            fontFamily: 'var(--font-lato), sans-serif',
          }}
        />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-80 focus:outline-none flex items-center justify-center ${
                hasError ? 'text-[#D9537A]' : 'text-gray-400'
              }`}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showPassword ? (
                  <>
                    <path
                      d="M1 1L23 23M9 9C8.5 9.5 8 10.2 8 11C8 12.1 8.9 13 10 13C10.8 13 11.5 12.5 12 12M21 12C21 12 17 18 12 18C11.5 18 11 17.9 10.5 17.7M3 3C2.4 3.6 1.9 4.2 1.5 5M6.5 6.5C5.8 7.2 5.3 8.1 5 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      {error && (
        <p className="mt-1 text-sm text-[#D9537A]">{error}</p>
      )}
    </div>
  );
};

export default Input;

