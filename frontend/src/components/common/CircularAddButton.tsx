'use client';

import React from 'react';
import Image from 'next/image';

export interface CircularAddButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  variant?: 'floating' | 'centered';
  iconSize?: number;
  hideLines?: boolean;
  labelClassName?: string;
}

const CircularAddButton: React.FC<CircularAddButtonProps> = ({
  onClick,
  label,
  className = '',
  variant = 'centered',
  iconSize = 64,
  hideLines = false,
  labelClassName = 'text-gray-700 text-sm font-medium mt-2 text-center',
}) => {
  const buttonClasses = `inline-flex items-center justify-center bg-transparent p-0 m-0 transition-transform hover:scale-105 ${className}`;

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={buttonClasses}
      aria-label={label || 'Agregar'}
    >
      <Image
        src="/ImagenSumar.png"
        alt="Agregar"
        width={iconSize}
        height={iconSize}
        className="pointer-events-none"
      />
    </button>
  );

  if (variant === 'floating') {
    return (
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        {button}
      </div>
    );
  }

  if (hideLines) {
    return (
      <div className="flex flex-col items-center w-full">
        {button}
        {label && (
          <p className={labelClassName}>{label}</p>
        )}
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
        <p className={labelClassName}>{label}</p>
      )}
    </div>
  );
};

export default CircularAddButton;

