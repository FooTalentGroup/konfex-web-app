'use client';

import React from 'react';

export interface AddFloatingButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  isStatic?: boolean;
}

const AddFloatingButton: React.FC<AddFloatingButtonProps> = ({
  onClick,
  label = 'Agregar',
  className = '',
  isStatic = false,
}) => {
  const baseButtonClasses = `bg-[#B65CF2] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow font-[var(--font-lato),sans-serif] font-medium text-sm sm:text-base ${className}`;
  
  const staticClasses = `w-full ${baseButtonClasses}`;
  const floatingClasses = `fixed bottom-16 sm:bottom-20 md:bottom-28 lg:bottom-32 xl:bottom-36 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-xs sm:max-w-sm z-10 ${baseButtonClasses}`;

  return (
    <button
      onClick={onClick}
      className={isStatic ? staticClasses : floatingClasses}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default AddFloatingButton;

