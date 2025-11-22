'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import BudgetForm from '@/components/ui/BudgetForm';
import PriceSummaryCard from '@/components/ui/PriceSummaryCard';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

export default function CalculatorPage() {
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
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-xl mx-auto bg-primary-500">
          <PriceSummaryCard
            total={250000}
            indirectCosts={2000}
            profit={50000}
          />
          <BudgetForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
