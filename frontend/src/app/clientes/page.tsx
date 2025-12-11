'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Trash2, X } from 'lucide-react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import ClientCard from '@/components/clients/ClientCard';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useClients } from '@/hooks/useClients';

export default function ClientsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    clients, 
    loading, 
    filterClients,
    deleteClient,
  } = useClients();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterClients(value);
  };

  const handleCardInteraction = (id: number) => {
    if (isSelectionMode) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(itemId => itemId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      router.push(`/clientes/${id}`);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteClient(id);
      }
      setIsSelectionMode(false);
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0F5] font-sans relative">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0F5] font-sans relative">
      
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Eliminar clientes"
        message={`¿Estás seguro de que deseas eliminar ${selectedIds.length} cliente${selectedIds.length > 1 ? 's' : ''}? Esta acción no se puede deshacer y se eliminarán todos los datos asociados.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <div className="bg-[#8B709D] px-6 pt-6 pb-8 shadow-md transition-all"> 
        <div className="mb-6 flex justify-between items-end">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">Cliente</h1>
                <p className="text-white/80 text-sm font-light">
                    {isSelectionMode ? 'Selecciona los clientes a eliminar' : 'Gestiona a todos tus clientes desde aquí.'}
                </p>
            </div>
            {isSelectionMode && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    {selectedIds.length} seleccionados
                </span>
            )}
        </div>

        <SearchBar 
          placeholder="Buscar cliente por nombre"
          value={searchTerm}
          onChange={handleSearch}
          onClear={() => handleSearch('')}
        />
      </div>

      <div className="px-5 pt-6 pb-32 space-y-3">
        {clients.length > 0 ? (
          clients.map((client) => (
              <ClientCard 
                  key={client.id}
                  name={client.nombre}
                  source={client.origen?.toLowerCase() === 'telegram' ? 'telegram' : 'manual'}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedIds.includes(client.id)}
                  onClick={() => handleCardInteraction(client.id)}
                  onBudgetClick={() => router.push(`/presupuestos?cliente=${client.id}`)}
                  onTelegramClick={() => console.log('Telegram', client.nombre)}
              />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-12 text-gray-400 gap-2">
              <Search size={40} className="opacity-20" />
              <p className="text-sm">No se encontraron clientes.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 flex items-center bg-[#8B709D] p-1.5 rounded-full shadow-xl z-50 transition-all gap-1">
          {isSelectionMode ? (
            <>
                <button onClick={toggleSelectionMode} className="w-12 h-12 bg-white/10 rounded-full text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                    <X size={24} />
                </button>
                <button 
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        selectedIds.length > 0 ? 'bg-red-400 text-white shadow-md' : 'bg-transparent text-white/30'
                    }`}
                >
                    <Trash2 size={24} />
                </button>
            </>
          ) : (
            <>
                 <button onClick={toggleSelectionMode} className="w-12 h-12 bg-transparent rounded-full text-white/80 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Trash2 size={24} />
                </button>
                <div className="w-[1px] h-6 bg-white/20"></div>
                <button 
                    onClick={() => router.push('/clientes/nuevo')}
                    className="w-12 h-12 bg-transparent rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                    <Plus size={32} />
                </button>
            </>
          )}
      </div>

    </div>
  );
}