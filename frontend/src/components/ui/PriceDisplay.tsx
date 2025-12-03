'use client';

import React from 'react';

export interface PriceDisplayProps {
  label: string;
  amount: string | number;
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  label,
  amount,
  className = '',
}) => {
  const formattedAmount = typeof amount === 'number'
    ? amount.toLocaleString('es-CO')
    : amount;

  return (
    <div className={`flex flex-col items-center justify-between ${className}`}>
      <span className="text-sm sm:text-base font-[var(--font-lato),sans-serif] font-semibold text-black">
        {label}
      </span>
      <span className="text-base sm:text-lg font-[var(--font-lato),sans-serif] font-bold text-[#B65CF2]">
        $ {formattedAmount}
      </span>
    </div>
  );
};

export default PriceDisplay;