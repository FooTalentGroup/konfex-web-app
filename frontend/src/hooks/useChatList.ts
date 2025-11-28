import { useState, useMemo } from 'react';
import { ChatItemProps } from '@/components/inbox/ChatItem';

export type FilterType = 'todos' | 'no-leidos' | 'leidos';

export interface PlataformaConfig {
  bg: string;
  borderColor?: string;
  iconType: 'telegram';
}

export function getPlataformaConfig(plataforma: 'telegram'): PlataformaConfig {
  return {
    bg: '#E3F2FD',
    borderColor: '#BBDEFB',
    iconType: 'telegram',
  };
}

export function useChatList(initialChats: ChatItemProps[] = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  const filteredChats = useMemo(() => {
    let filtered = initialChats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chat) =>
        chat.nombre.toLowerCase().includes(query)
      );
    }

    if (activeFilter === 'no-leidos') {
      filtered = filtered.filter((chat) => !chat.tienePresupuesto);
    } else if (activeFilter === 'leidos') {
      filtered = filtered.filter((chat) => chat.tienePresupuesto);
    }

    return filtered;
  }, [initialChats, searchQuery, activeFilter]);

  return {
    filteredChats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  };
}

