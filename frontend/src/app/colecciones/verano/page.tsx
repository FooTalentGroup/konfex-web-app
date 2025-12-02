'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import BackNavigationBar from '@/components/common/BackNavigationBar';
import SearchBarWhite from '@/components/common/SearchBarWhite';
import CollectionCard from '@/components/common/CollectionCard';
import AddFloatingButton from '@/components/common/AddFloatingButton';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useCollections } from '@/hooks/useCollections';

export default function SummerPage() {
  const router = useRouter();
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const {
    filteredGarments,
    garmentSearchQuery,
    handleGarmentSearch,
    handleGarmentClick,
    handleAddGarment,
  } = useCollections();

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <BackNavigationBar
          title="Verano 2025"
          breadcrumbs={[
            { label: 'Tus colecciones' }
          ]}
        />

        <div className="bg-[#E6E1EA] rounded-t-2xl py-3 sm:py-4 md:py-5 flex-1">
          <div className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-xs sm:max-w-sm mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-5 pt-3 sm:pt-4 md:pt-5">
              <SearchBarWhite
                placeholder="Buscar color, precio..."
                value={garmentSearchQuery}
                onChange={handleGarmentSearch}
              />
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-5 md:pb-6">
              {filteredGarments.map((garment) => (
                <CollectionCard
                  key={garment.id}
                  id={garment.id}
                  name={garment.name}
                  color={garment.color}
                  size={garment.size}
                  price={garment.price}
                  imageUrl={garment.imageUrl}
                  onClick={() => handleGarmentClick(garment.id)}
                />
              ))}
            </div>

            <div className="pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10">
              <AddFloatingButton onClick={handleAddGarment} isStatic={true} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}