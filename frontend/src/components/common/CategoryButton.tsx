'use client';

import React from 'react';

export interface CategoryButtonProps {
  label: string;
  icon?: React.ReactNode;
  iconPath?: string;
  onClick?: () => void;
  className?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  icon,
  iconPath,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg transition-all hover:opacity-90 bg-[#E6E1EA] border border-[#D5A1F7] ${className}`}
    >
      {iconPath ? (
        <div className="mb-2">
          <img
            src={iconPath}
            alt={label}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain [image-rendering:crisp-edges]"
            style={{
              filter: 'brightness(0) saturate(100%) invert(58%) sepia(95%) saturate(5000%) hue-rotate(260deg) brightness(1.1) contrast(1.1)',
            }}
          />
        </div>
      ) : (
        icon && <div className="mb-2 text-[#B65CF2]">{icon}</div>
      )}
      <span className="text-center text-[#6A5379] font-[var(--font-lato),sans-serif] font-bold text-sm leading-[131%] tracking-[0%]">
        {label}
      </span>
    </button>
  );
};

export default CategoryButton;
