'use client';

import React from 'react';
import Image from 'next/image';
import { Palette, Ruler, DollarSign } from 'lucide-react';

export interface CollectionCardProps {
    id: string;
    name: string;
    color: string;
    size: string;
    price: string;
    imageUrl: string;
    onClick: () => void;
    className?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    name,
    color,
    size,
    price,
    imageUrl,
    onClick,
    className = '',
}) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 cursor-pointer transition-all shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#e8e8e8] hover:bg-[#F3EFF7] hover:border-[#C38AF7]  hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:bg-[#F3EFF7] active:border-[#C38AF7] active:shadow-[0_4px_16px_rgba(0,0,0,0.10)] focus-visible:border-[#C38AF7] focus-visible:shadow-[0_0_0_3px_rgba(195,138,247,0.35)] ${className}`}
        >
            <div className="flex-shrink-0 w-16 h-16 border border-secondary-600 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="grid grid-cols-1 gap-y-1 sm:space-y-1.5">
                <h3 className="text-sm sm:text-base font-[var(--font-lato),sans-serif] font-bold text-black truncate">
                    {name}
                </h3>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center">
                    <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-[#B65CF2] flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-[var(--font-lato),sans-serif] text-[#6A5379] truncate">
                            {color}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" strokeWidth={1.5} stroke='currentColor' className="w-3 h-3 sm:w-4 sm:h-4 text-[#B65CF2] flex-shrink-0">
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" d="M10 19.958C10 22.19 13.58 24 18 24V19.958C18 17.97 18 16.974 17.206 16.368C16.41 15.762 15.622 15.988 14.046 16.442C11.63 17.14 10 18.45 10 19.958Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M32 17C32 20.866 25.732 24 18 24C10.268 24 4 20.866 4 17C4 13.134 10.268 10 18 10C25.732 10 32 13.134 32 17Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 18V31.334C4 35.014 10.268 38 18 38H40C41.886 38 42.828 38 43.414 37.414C44 36.828 44 35.886 44 34V28C44 26.114 44 25.172 43.414 24.586C42.828 24 41.886 24 40 24H18" />
                            <path d="M36 38V34M28 38V34M20 38V34M12 37V33" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs sm:text-sm font-[var(--font-lato),sans-serif] text-[#6A5379]">
                            {size}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 text-[#B65CF2] flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-[var(--font-lato),sans-serif] text-[#6A5379]">
                            {price}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CollectionCard;