'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import BackNavigationBar from '@/components/common/BackNavigationBar';
import SearchBarWhite from '@/components/common/SearchBarWhite';
import AddFloatingButton from '@/components/common/AddFloatingButton';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

export default function SummerPage() {
  const router = useRouter();
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();


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
                value={''}
                onChange={() => {}}
              />
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-5 md:pb-6">
              
            </div>

            <div className="pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10">
              <AddFloatingButton onClick={() => { router.push('/collections/summer/create-clothing') }} isStatic={true} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
