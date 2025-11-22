'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import CategoryButton from '@/components/common/CategoryButton';
import UploadButton from '@/components/common/UploadButton';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useMaterials } from '@/hooks/useMaterials';

export default function MateriaPrimaPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const {
    searchQuery,
    selectedCategory,
    handleSearch,
    handleCategoryToggle,
    handleAddMaterial,
    handleUploadPDF,
  } = useMaterials();

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#9D86AC]">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col">
        <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-[#9D86AC]">
          <SearchBar
            placeholder="Buscar material..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-xs sm:max-w-md md:max-w-2xl mx-auto"
          />
        </div>

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
          <div className="w-full max-w-xs sm:max-w-sm mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl mb-2 text-[#770FBD] font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%]">
              Tus materiales
            </h1>
            <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 text-black font-[var(--font-lato),sans-serif]">
              Ten a mano todas tus telas, hilos y accesorios para crear tus prendas sin complicarte.
            </p>

            <div>
              <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-4 sm:gap-y-5 md:gap-y-6 mb-6 sm:mb-8">
                <CategoryButton
                  label="Tela"
                  iconPath="/telas.png"
                  onClick={() => handleCategoryToggle('tela')}
                />
                <CategoryButton
                  label="Botones"
                  iconPath="/botones.png"
                  onClick={() => handleCategoryToggle('botones')}
                />
                <CategoryButton
                  label="Hilos"
                  iconPath="/hilos.png"
                  onClick={() => handleCategoryToggle('hilos')}
                />
                <CategoryButton
                  label="Agregar material"
                  iconPath="/agregar.png"
                  onClick={handleAddMaterial}
                />
              </div>

              <div className="flex justify-end mt-16 sm:mt-24 md:mt-48 mb-8 sm:mb-12 md:mb-20">
                <div className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.25rem)/2)]">
                  <UploadButton onClick={handleUploadPDF} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
