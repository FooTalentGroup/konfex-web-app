'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export interface BackNavigationBarProps {
  title: string;
  breadcrumb?: {
    label: string;
    color?: string;
  };
  onBack?: () => void;
  className?: string;
}

const BackNavigationBar: React.FC<BackNavigationBarProps> = ({
  title,
  breadcrumb,
  onBack,
  className = '',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`bg-white rounded-b-2xl ${className}`}>
      <div className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-xs sm:max-w-sm mx-auto py-2.5 sm:py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="pl-2.5 sm:pl-3 md:pl-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#8B709D] hover:bg-[#7A608D] transition-colors flex-shrink-0 -ml-2 sm:-ml-2.5"
              aria-label="Volver"
            >
              <Image
                src="/flechaTela.png"
                alt="Volver"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
            </button>
          </div>
          {breadcrumb ? (
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-1 min-w-0 justify-end">
              <span className="text-xs sm:text-sm md:text-base font-[var(--font-lato),sans-serif] font-normal leading-[131%] tracking-[0%] text-[#9D86AC] truncate">
                {breadcrumb.label}
              </span>
              <Image
                src="/flecha.png"
                alt=""
                width={12}
                height={12}
                className="flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5"
              />
              <span className="text-sm sm:text-base md:text-lg font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%] text-[#770FBD] pr-2.5 sm:pr-3 md:pr-4">
                {title}
              </span>
            </div>
          ) : (
            <h2 className="text-sm sm:text-base md:text-lg font-[var(--font-lato),sans-serif] font-normal leading-[131%] tracking-[0%] text-[#770FBD] pr-2.5 sm:pr-3 md:pr-4 truncate">
              {title}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackNavigationBar;

