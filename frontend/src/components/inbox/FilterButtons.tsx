'use client';

import React from 'react';

type FilterType = 'todos' | 'no-leidos' | 'leidos';

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const filters = [
    { id: 'no-leidos' as FilterType, label: 'No leidos' },
    { id: 'leidos' as FilterType, label: 'Leidos' },
    { id: 'todos' as FilterType, label: 'Todos mensajes' },
  ];

  return (
    <div className="flex mb-6" style={{ gap: '8px' }}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className="transition-colors"
            style={{
              fontFamily: 'var(--font-lato), sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '131%',
              letterSpacing: '0%',
              borderRadius: '12px',
              border: '1px solid',
              paddingTop: '4px',
              paddingRight: '12px',
              paddingBottom: '4px',
              paddingLeft: '12px',
              backgroundColor: isActive ? '#D5A1F7' : 'transparent',
              borderColor: '#D5A1F7',
              color: isActive ? '#1E042F' : '#8B709D',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#D5A1F7';
                e.currentTarget.style.color = '#1E042F';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#8B709D';
              }
            }}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;

