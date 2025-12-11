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

  return (
    <div className={`flex flex-col items-center justify-between ${className}`}>
      <span className="text-base sm:text-base font-[var(--font-lato),sans-serif] font-semibold text-black">
        {label}
      </span>
      <span className="text-lg sm:text-lg font-[var(--font-lato),sans-serif] font-bold text-[#B65CF2]">
        $ {amount}
      </span>
    </div>
  );
};

export default PriceDisplay;