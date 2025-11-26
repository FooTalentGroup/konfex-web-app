'use client';

import React from 'react';
import NavigationTabs from '@/components/ui/NavigationTabs';
import SearchBar from '@/components/common/SearchBar';

interface InboxHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ 
  searchValue = '', 
  onSearchChange 
}) => {
  return (
    <div 
      className="w-full px-4 sm:px-6 py-4"
      style={{
        backgroundColor: '#9D86AC',
      }}
    >
      <NavigationTabs
        tabs={[
          { label: 'Inbox', href: '/inbox' },
          { label: 'Calculadora', href: '/calculator' },
          { label: 'Pedidos', href: '/orders' },
        ]}
        className="mb-4"
      />
      <div className="px-2">
        <SearchBar
          placeholder="Buscar chat por nombre"
          value={searchValue}
          onChange={onSearchChange || (() => {})}
          className="max-w-xs sm:max-w-sm mx-auto"
        />
      </div>
    </div>
  );
};

export default InboxHeader;

