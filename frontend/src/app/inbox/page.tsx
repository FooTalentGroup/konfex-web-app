'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import InboxHeader from '@/components/inbox/InboxHeader';
import FilterButtons from '@/components/inbox/FilterButtons';
import ChatList from '@/components/inbox/ChatList';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useChatList } from '@/hooks/useChatList';

export default function InboxPage() {
  const router = useRouter();
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const {
    filteredChats,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  } = useChatList();

  const handleChatClick = (chatId: number) => {
    router.push(`/inbox/chat/${chatId}`);
  };

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#9D86AC]">
        <Header onMenuClick={openSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 flex items-center justify-center">
          <p className="font-lato text-sm text-white">Cargando chats...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#9D86AC]">
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

