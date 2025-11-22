'use client';

import React from 'react';
import Image from 'next/image';

export interface MaterialCardProps {
  id: string;
  name: string;
  colors?: string[];
  measure?: string;
  price?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  name,
  colors = [],
  measure,
  price,
  imageUrl,
  onClick,
  className = '',
}) => {
  const colorsText = colors.length > 0 
    ? colors.length > 3 
      ? `${colors.slice(0, 3).map(c => c.length > 4 ? c.substring(0, 4) : c).join(', ')}, ...`
      : `${colors.map(c => c.length > 4 ? c.substring(0, 4) : c).join(', ')}, ...`
    : 'Sin colores';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left ${className}`}
    >
      <div className="flex-shrink-0">
        {imageUrl ? (
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
            >
              <path
                d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%] text-[#0D0A0F] mb-1 sm:mb-1.5 truncate">
          {name}
        </h3>
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-[var(--font-lato),sans-serif] font-normal leading-[131%] tracking-[0%] text-[#0D0A0F]">
            <Image
              src="/logoColores.png"
              alt="Colores"
              width={14}
              height={14}
              className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5"
            />
            <span className="truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">{colorsText}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0">
            {measure && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-[var(--font-lato),sans-serif] font-normal leading-[131%] tracking-[0%] text-[#0D0A0F]">
                <Image
                  src="/metraje.png"
                  alt="Metraje"
                  width={14}
                  height={14}
                  className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5"
                />
                <span className="whitespace-nowrap">{measure}</span>
              </div>
            )}
            {price && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-[var(--font-lato),sans-serif] font-normal leading-[131%] tracking-[0%] text-[#0D0A0F]">
                <Image
                  src="/precio.png"
                  alt="Precio"
                  width={14}
                  height={14}
                  className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5"
                />
                <span className="truncate max-w-[60px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px]">{price}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default MaterialCard;

