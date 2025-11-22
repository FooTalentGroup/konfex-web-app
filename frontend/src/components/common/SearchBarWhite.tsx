'use client';

import React from 'react';

export interface SearchBarWhiteProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

const SearchBarWhite: React.FC<SearchBarWhiteProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onClear,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-full flex items-center rounded-xl sm:rounded-2xl px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 min-h-[40px] sm:min-h-[44px] md:min-h-[48px] gap-1.5 sm:gap-2 bg-white border border-gray-300">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-xs sm:text-sm md:text-base font-normal leading-[131%] tracking-[0%] text-gray-700 placeholder:text-gray-400 placeholder:opacity-70 font-[var(--font-lato),sans-serif]"
        />
        <button
          onClick={handleClear}
          className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full hover:opacity-70 transition-opacity flex-shrink-0 cursor-pointer ${value ? 'opacity-100' : 'opacity-50'}`}
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBarWhite;

