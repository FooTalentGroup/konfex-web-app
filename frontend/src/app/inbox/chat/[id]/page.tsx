'use client';

import React, { use } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import ChatHeader from '@/components/inbox/ChatHeader';
import ChatMessages from '@/components/inbox/ChatMessages';
import ChatInput from '@/components/inbox/ChatInput';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useChat } from '@/hooks/useChat';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const {
    contact,
    messages,
    isLoading,
    messageText,
    setMessageText,
    sendMessage,
    handleKeyPress,
  } = useChat(resolvedParams.id);

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
          <p className="font-lato text-sm text-white">
            Cargando...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-full overflow-x-hidden bg-[#FAF8FC]">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex items-start md:items-start justify-center w-full px-0 h-[86vh] sm:px-4 pt-0 pb-0 md:pb-8 md:mt-2 md:pt-6">
        <div className="w-full md:max-w-sm lg:max-w-md xl:max-w-lg  mx-auto flex flex-col h-full  md:rounded-2xl md:shadow-lg overflow-hidden bg-[#FAFAFA]">
          <div className="w-full flex-shrink-0">
            <ChatHeader contact={contact} />
          </div>

          <main className="flex-1 flex flex-col overflow-hidden w-full min-h-0">
            <ChatMessages messages={messages} />
          </main>

          <div className="w-full flex-shrink-0">
            <ChatInput
              value={messageText}
              onChange={setMessageText}
              onSend={sendMessage}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

