"use client";
import React from 'react'
import CreateFabricTemplate from '@/components/common/CreateFabricTemplate'
import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'
import { useAuth, useSidebar } from '@/hooks';

export default function CreateFabricPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

  if (!mounted && !user) return null;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 sm:p-6">
        <CreateFabricTemplate />
      </main>

    </div>
  )
}


