'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface CategoryButtonProps {
  label: string;
  icon?: React.ReactNode;
  iconPath?: string;
  onClick?: () => void;
  className?: string;
  isDeleteMode?: boolean;
  isSelected?: boolean; // Mantenemos por compatibilidad pero no lo usamos
  onDeleteClick?: () => void;
  canDelete?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  icon,
  iconPath,
  onClick,
  className = '',
  isDeleteMode = false,
  onDeleteClick,
  canDelete = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se ejecute el onClick principal
    if (onDeleteClick) {
      onDeleteClick();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          relative w-full
          flex flex-col items-center justify-center 
          p-3 sm:p-4 rounded-lg 
          transition-all 
          bg-[#E6E1EA] border border-[#D5A1F7]
          hover:opacity-90
          ${className}
        `}
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

        {/* Icono de tacho en la esquina superior derecha - clickeable directamente */}
        {isDeleteMode && canDelete && (
          <div
            className="absolute top-[-10px] right-[-8px] cursor-pointer"
            onClick={handleDeleteClick}
          >
            <div className="bg-[var(--background-light)] opacity-60 rounded-full p-1 transition-all duration-200 shadow-lg">
              <X className="w-5 h-5 text-[#5A0B8E] " strokeWidth={1.1} />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default CategoryButton;