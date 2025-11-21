'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import ApiTest from '@/components/common/ApiTest';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

export default function Home() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        onMenuClick={openSidebar}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-blue-600">
          Hola Mundo - EOS Frontend
        </h1>
        <p className="mt-4 text-xl text-primary-500">Entorno local configurado correctamente.</p>
        
        <ApiTest />
      </main>
      <Footer />
    </div>
  );
}