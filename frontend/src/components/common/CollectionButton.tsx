'use client';

import React from 'react';

export interface CollectionButtonProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const CollectionButton: React.FC<CollectionButtonProps> = ({
  title,
  subtitle,
  icon,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col w-full h-full items-center justify-center p-5 sm:p-6 rounded-lg transition-all hover:opacity-90 border border-[#D5A1F7] ${
        isActive 
          ? 'bg-[#B65CF2] text-white' 
          : 'bg-[#E6E1EA] text-[#6A5379]'
      } ${className}`}
    >
      {icon ? (
        <>
          <div className="mb-2 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-center font-[var(--font-lato),sans-serif] font-bold text-sm leading-[131%] tracking-[0%]">
            {title}
          </span>
        </>
      ) : (
        <>
          <span className="text-center font-[var(--font-lato),sans-serif] font-bold text-base sm:text-lg mb-1">
            {title}
          </span>
          <span className="text-center font-[var(--font-lato),sans-serif] font-normal text-xs sm:text-sm">
            {subtitle}
          </span>
        </>
      )}
    </button>
  );
};

export default CollectionButton;