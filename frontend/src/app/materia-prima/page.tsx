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
import AddCategoryModal from '@/components/common/AddCategoryModal';
import UploadPDFModal from '@/components/common/UploadPDFModal';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useMaterials } from '@/hooks/useMaterials';
import { usePDFUpload } from '@/hooks/usePDFUpload';
import { useCategoryDelete } from '@/hooks/useCategoryDelete';
import { useCategories } from '@/hooks/useCategories';
import { Plus } from 'lucide-react';

export default function MateriaPrimaPage() {
  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
  const router = useRouter();
  const {
    searchQuery,
    handleSearch,
    handleAddMaterial,
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
    addCategory,
  } = useCategories();

  // Estado modal agregar categoría
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Estado modal confirmar eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);

  const handleCategoryClick = (slug: string) => {
    if (!isDeleteMode) {
      router.push(`/materia-prima/${slug}`);
    }
  };

  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    setCategoryToDelete({ id: categoryId, name: categoryName });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete.id;

    setDeleteModalOpen(false);
    setCategoryToDelete(null);

    try {
      const success = await deleteCategory(categoryId);


    } catch (err: any) {

    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleConfirmAdd = async (nombre: string) => {
    return await addCategory(nombre);
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

        <div className="w-full px-5 sm:px-4 md:px-6 py-3 sm:py-4 bg-[var(--primary-color-500)]">
          <h1 className="text-xl sm:text-xl md:text-2xl mb-1.5 text-white font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%]">
            Tus materiales
          </h1>
          <p className="text-sm text-[#FBF4FF] font-[var(--font-lato),sans-serif] mb-3.5">
            Organiza tus telas ,hilos y accesorios fácilmente.
          </p>
          <SearchBar
            placeholder="Buscar material..."
            value={searchQuery}
            onChange={handleSearch}
            className=" mx-auto"
          />
        </div>

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
          <div className="w-full sm:max-w-sm mx-auto">


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
                      onDeleteClick={() => handleDeleteCategory(category.id, category.nombre)}
                      canDelete={true}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        </main>

        {/* Botones de acción */}
        <div className="bg-[#E6E1EA] flex justify-center items-center p-4 sm:p-6 md:p-8 gap-3">
          {/* Botones que van a la izquierda según necesidad */}
          <div className='flex justify-center gap-4 bg-[var(--primary-color-300)] rounded-l-4xl rounded-r-4xl py-2 px-4'>
            <button
              className='bg-[var(--primary-color-500)] flex items-center justify-center
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full
                transition-all duration-200
                shadow-lg
                hover:bg-[var(--primary-color-600)]'
              onClick={handleOpenAddModal}
            >
              <Plus size={20} className="text-white" />
            </button>

            <DeleteButton
              onClick={toggleDeleteMode}
              isActive={isDeleteMode}
            />
          </div>

          {/* Botón de upload a la derecha */}
          <div className="sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-1.25rem)/2)]">
            <UploadButton onClick={handleUploadPDF} className="w-full" />
          </div>
        </div>
      </div>

      {/* Modal de agregar categoría */}
      <AddCategoryModal
        isOpen={addModalOpen}
        onClose={handleCloseAddModal}
        onConfirm={handleConfirmAdd}
      />

      {/* Modal de confirmar eliminación */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        title="¿Estás seguro de eliminar este material? "
        message="Si eliminas este material, también se eliminarán todos los elementos que contiene."
        cancelText="Cancelar"
        confirmText="Aceptar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Modal de subir PDF */}
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