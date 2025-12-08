'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import CategoryButton from '@/components/common/CategoryButton';
import UploadButton from '@/components/common/UploadButton';
import DeleteButton from '@/components/common/DeleteButton';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useMaterials } from '@/hooks/useMaterials';
import { usePDFUpload } from '@/hooks/usePDFUpload';
import { useCategoryDelete } from '@/hooks/useCategoryDelete';
import { useCategories } from '@/hooks/useCategories';
import UploadPDFModal from '@/components/common/UploadPDFModal';
import { Plus } from 'lucide-react';
import ActionBar from '@/components/common/ActionBar';

export default function MateriaPrimaPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const router = useRouter();
  const {
    searchQuery,
    handleSearch,
  } = useMaterials();
  const {
    fileInputRef,
    handleFileSelect,
    isModalOpen,
    handleCloseModal,
    handleRetry,
    handleUploadPDF,
    uploadInfo,
    uploadState
  } = usePDFUpload();

  const {
    isDeleteMode,
    toggleDeleteMode,
  } = useCategoryDelete();

  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    deleteCategory,
    fetchCategories,
    addCategory,
  } = useCategories();

  // Estado para agregar nueva categoría
  const [showAddModal, setShowAddModal] = useState(false);

  // Manejar agregar categoría
  const handleAddCategory = async (nombre: string) => {
    if (!nombre.trim()) return;
    await addCategory(nombre);
  };

  // Estado para el modal de confirmación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Navegar a cualquier categoría
  const handleCategoryClick = (slug: string) => {
    if (!isDeleteMode) {
      router.push(`/materia-prima/${slug}`);
    }
  };

  // Abrir el modal de confirmación
  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setDeleteModalOpen(true);
  };

  // Confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);

    const success = await deleteCategory(categoryToDelete.id);

    setIsDeleting(false);
    setDeleteModalOpen(false);
    setCategoryToDelete(null);

    if (success) {
      alert('Categoría eliminada exitosamente');
      // Refrescar las categorías después de eliminar
      await fetchCategories();
    } else {
      alert('No se puede eliminar esta categoría. Asegúrate de que no tenga materiales asociados.');
    }
  };

  // Cancelar la eliminación
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

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

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex-1 flex flex-col">
        <div className="w-full px-4 pt-8 pb-4 bg-[var(--primary-color-500)] ">
          <h1 className="text-lg sm:text-xl md:text-2xl mb-1 text-[var(--bg-gray-color-500)] font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%]">
            Tus materiales
          </h1>
          <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 font-[var(--font-lato),sans-serif] text-[var(--bg-gray-color-500)]">
            Organiza tus telas, hilos y accesorios fácilmente.          </p>
          <SearchBar
            placeholder="Buscar material..."
            value={searchQuery}
            onChange={handleSearch}
            className=" mx-auto"
          />
        </div>

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
          <div className="w-full max-w-xs sm:max-w-sm mx-auto">


            <div>
              {/* Loading state */}
              {isLoadingCategories && (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              )}

              {/* Error state */}
              {categoriesError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="font-bold">Error</p>
                  <p>{categoriesError}</p>
                </div>
              )}

              {/* Grid de categorías dinámico */}
              {!isLoadingCategories && !categoriesError && (

                <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-4 sm:gap-y-5 md:gap-y-6 mb-6 sm:mb-8">
                  {categories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      label={category.nombre}
                      iconPath={category.iconPath}
                      onClick={() => handleCategoryClick(category.slug)}
                      isDeleteMode={isDeleteMode}
                      isSelected={false}
                      onDeleteClick={() => handleDeleteCategory(String(category.id), category.nombre)}
                      canDelete={true}
                    />
                  ))}
                </div>

              )}

              {/* Mensaje cuando está en modo delete */}
              {/* {isDeleteMode && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 text-center">
                    Toca el ícono de basura en cualquier categoría para eliminarla
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </main>

        {/* Botones de acción */}
        <div className="bg-[#E6E1EA] flex justify-center items-center p-4 sm:p-6 md:p-8 gap-3">
          {/* Botones de eliminar y agregar a la izquierda */}
          <ActionBar
            simpleButtons={[
              {
                icon: <Plus size={20} />,
                onClick: () => setShowAddModal(true)
              }
            ]}
          >
            <DeleteButton
              onClick={toggleDeleteMode}
              isActive={isDeleteMode}
            />
          </ActionBar>
          {/* Botón de upload a la derecha */}
          <div className="sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.25rem)/2)]">
            <UploadButton onClick={handleUploadPDF} className="w-full" />
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        categoryName={categoryToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <UploadPDFModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        state={uploadState === 'idle' ? 'uploading' : uploadState}
        fileName={uploadInfo.fileName}
        fileSize={uploadInfo.fileSize}
        progress={uploadInfo.progress}
        uploadSpeed={uploadInfo.uploadSpeed}
        onRetry={handleRetry}
      />
      <Footer />
    </div>
  );
}