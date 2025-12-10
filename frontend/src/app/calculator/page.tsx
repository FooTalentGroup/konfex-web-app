"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import CalculatorTemplate from "@/components/calculator/CalculatorTemplate";

export default function CalculatorPage() {
  const { user, mounted } = useAuth();
  const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  } = useSidebar();

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFCFF]">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 pt-0 pb-6 px-0 sm:pt-0 sm:px-6">
        <CalculatorTemplate />
      </main>
      <Footer />
    </div>
  );
}
