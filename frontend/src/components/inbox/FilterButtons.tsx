'use client';

import React from 'react';

type FilterType = 'all' | 'unread' | 'read';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const filters = [
    { id: 'unread' as FilterType, label: 'No leídos' },
    { id: 'read' as FilterType, label: 'Leídos' },
    { id: 'all' as FilterType, label: 'Todos los mensajes' },
  ];

  return (
    <div className="flex mb-6 gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`font-lato text-sm font-normal leading-[131%] tracking-[0%] rounded-xl border border-[#D5A1F7] py-1 px-3 transition-colors ${
              isActive
                ? 'bg-[#D5A1F7] text-[#1E042F]'
                : 'bg-transparent text-[#8B709D] hover:bg-[#D5A1F7] hover:text-[#1E042F]'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;

