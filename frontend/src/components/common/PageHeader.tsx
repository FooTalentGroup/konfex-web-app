'use client';

import React from 'react';
import SearchBar from './SearchBar';

export interface PageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  backgroundColor?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  backgroundColor = '#9D86AC',
  className = '',
}) => {
  return (
    <div
      className={`w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-2 sm:pb-3 ${className}`}
      style={{ backgroundColor }}
    >
      <div className="max-w-md mx-auto">
        <h1
          className="mb-2 text-left"
          style={{
            fontFamily: 'var(--font-lato), sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            lineHeight: '131%',
            letterSpacing: '0%',
            color: '#FFFFFF',
          }}
        >
          {title}
        </h1>
        <p
          className="mb-4 sm:mb-5 md:mb-6 text-left text-xs sm:text-sm"
          style={{
            fontFamily: 'var(--font-lato), sans-serif',
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: '0.875rem', // Small size
            lineHeight: '131%',
            letterSpacing: '0%',
            color: '#FFFFFF',
            opacity: 0.9,
          }}
        >
          {description}
        </p>
        {searchValue !== undefined && onSearchChange && (
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
          />
        )}
      </div>
    </div>
  );
};

export default PageHeader;

