'use client';

import React from 'react';

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value,
  onChange,
  onClear,
  className = '',
}) => {
  const handleValueChange = (value: string) => {
    onChange(value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-full flex items-center rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 min-h-[40px] sm:min-h-[44px] md:min-h-[48px] gap-1.5 sm:gap-2 bg-[#b5a4c166] border border-[#B5A4C1]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0 text-[#F3F0F5]"
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
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-xs sm:text-sm md:text-base font-normal text-[14px] leading-[131%] tracking-[0%] text-[#CEC2D6] placeholder:text-[var(--background-light)] placeholder:opacity-100 font-[var(--font-lato),sans-serif]"
        />
        <button
          onClick={handleClear}
          className={`flex items-center justify-center w-6 h-6 rounded-full hover:opacity-70 transition-opacity flex-shrink-0 cursor-pointer ${value ? 'opacity-100' : 'opacity-50'}`}
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#F3F0F5]"
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

export default SearchBar;
