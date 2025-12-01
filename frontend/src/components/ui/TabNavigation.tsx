'use client';

import React from 'react';

export interface TabNavigationProps {
    tabs: string[];
    activeTab: number;
    onChange: (index: number) => void;
    className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
    tabs,
    activeTab,
    onChange,
    className = '',
}) => {
    return (
        <div className={`flex border-b border-primary-300 ${className}`}>
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    onClick={() => onChange(index)}
                    className={`flex-1 py-3 px-4 text-sm sm:text-base font-[var(--font-lato),sans-serif] transition-colors relative ${activeTab === index
                            ? 'text-[#B65CF2] font-semibold'
                            : 'text-gray-500 font-normal hover:text-gray-700'
                        }`}
                >
                    {tab}
                    {activeTab === index && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B65CF2]" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;