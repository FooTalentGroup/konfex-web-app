'use client';

import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import PageHeader from '@/components/common/PageHeader';
import BudgetCard from '@/components/common/BudgetCard';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useBudgets } from '@/hooks/useBudgets';

export default function PresupuestosPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const {
    filteredBudgets,
    searchQuery,
    handleSearch,
    handleBudgetClick,
    isLoading,
    error,
  } = useBudgets();

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
        <PageHeader
          title="Presupuestos"
          description="Consulta y edita a todos tus presupuestos desde aquí."
          searchPlaceholder="Nombre o número"
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          backgroundColor="#9D86AC"
        />

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 md:p-8 bg-white">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            {isLoading && (
              <div className="text-center py-12">
                <p 
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'var(--font-lato), sans-serif' }}
                >
                  Cargando presupuestos...
                </p>
              </div>
            )}
            {error && (
              <div className="text-center py-12">
                <p 
                  className="text-red-500 text-sm"
                  style={{ fontFamily: 'var(--font-lato), sans-serif' }}
                >
                  {error}
                </p>
              </div>
            )}
            {!isLoading && !error && (
              <>
                <div className="divide-y divide-gray-200">
                  {filteredBudgets.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      id={budget.id}
                      numeroPresupuesto={budget.numeroPresupuesto}
                      clienteNombre={budget.clienteNombre}
                      totalVenta={budget.totalVenta}
                      fechaVencimiento={budget.fechaVencimiento}
                      estado={budget.estado}
                      onClick={() => handleBudgetClick(budget.id)}
                    />
                  ))}
                </div>
                {filteredBudgets.length === 0 && (
                  <div className="text-center py-12">
                    <p 
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: 'var(--font-lato), sans-serif' }}
                    >
                      No se encontraron presupuestos
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

