'use client';

import React from 'react';
import { Plus } from 'lucide-react';

export interface CircularAddButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  variant?: 'floating' | 'centered';
  iconSize?: number;
}

const CircularAddButton: React.FC<CircularAddButtonProps> = ({
  onClick,
  label,
  className = '',
  variant = 'centered',
  iconSize = 28,
}) => {
  const buttonClasses = `w-14 h-14 bg-[#F2BB5C] rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_0_rgba(242,187,92,0.39)] hover:bg-[#E0A84B] transition-all hover:scale-105 border-[6px] border-[#F3F0F5] ${className}`;

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={buttonClasses}
      aria-label={label || 'Agregar'}
    >
      <Plus size={iconSize} strokeWidth={3} />
    </button>
  );

  if (variant === 'floating') {
    return (
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        {button}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full">
        <div className="flex-1 h-px bg-gray-200"></div>
        {button}
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      {label && (
        <p className="text-center text-gray-700 text-sm font-medium mt-2">
          {label}
        </p>
      )}
    </div>
  );
};

export default CircularAddButton;

