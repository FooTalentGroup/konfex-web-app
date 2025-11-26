'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import InboxHeader from '@/components/inbox/InboxHeader';
import FilterButtons from '@/components/inbox/FilterButtons';
import ChatList from '@/components/inbox/ChatList';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { ChatItemProps } from '@/components/inbox/ChatItem';

type FilterType = 'todos' | 'no-leidos' | 'leidos';

const mockChats: ChatItemProps[] = [
  {
    id: 1,
    avatar: '/perfil.png',
    nombre: 'Nombre',
    mensaje: 'Text',
    hora: '11:30',
    plataforma: 'instagram',
    tienePresupuesto: true,
  },
  {
    id: 2,
    avatar: '/perfil.png',
    nombre: 'Nombre',
    mensaje: 'Text',
    hora: '11:30',
    plataforma: 'whatsapp',
    tienePresupuesto: true,
  },
  {
    id: 3,
    avatar: '/perfil.png',
    nombre: 'Nombre',
    mensaje: 'Text',
    hora: '11:30',
    plataforma: 'instagram',
    tienePresupuesto: true,
  },
  {
    id: 4,
    avatar: '/perfil.png',
    nombre: 'Nombre',
    mensaje: 'Text',
    hora: '11:30',
    plataforma: 'whatsapp',
    tienePresupuesto: true,
  },
  {
    id: 5,
    avatar: '/perfil.png',
    nombre: 'Nombre',
    mensaje: 'Text',
    hora: '11:30',
    plataforma: 'instagram',
    tienePresupuesto: true,
  },
];

export default function InboxPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  const filteredChats = useMemo(() => {
    let filtered = mockChats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chat) =>
        chat.nombre.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery]);

  const handleChatClick = (chatId: number) => {
  };

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#9D86AC' }}>
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <InboxHeader 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 rounded-t-3xl bg-white p-4 sm:p-6">
        <div className="max-w-xs sm:max-w-sm mx-auto w-full">
          <FilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <ChatList
            chats={filteredChats}
            onChatClick={handleChatClick}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

