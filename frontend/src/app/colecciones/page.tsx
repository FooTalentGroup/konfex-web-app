"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import SearchBar from "@/components/common/SearchBar";
import CollectionButton from "@/components/common/CollectionButton";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { useCollections } from "@/hooks/useCollections";
import CreateCollectionInput from "@/components/ui/CreateCollectionInput";
import BtnActionsCollections from "@/components/ui/BtnActionsCollection";
import DeleteCollectionModal from "@/components/ui/DeleteCollectionModal";

export default function CollectionsPage() {
  const { user, mounted } = useAuth();
  const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  } = useSidebar();
  const {
    searchQuery,
    selectedCollection,
    filteredCollections,
    isLoading,
    error,
    handleSearch,
    handleCollectionToggle,

    isCreatingMode,
    newCollectionName,
    isCreating,

    isDeleteMode,
    isDeleting,
    collectionsToDelete,
    toggleCollectionForDeletion,
    toggleDeleteMode,
    confirmDeletion,

    startCreatingMode,
    cancelCreatingMode,
    handleNewCollectionNameChange,
    createCollection,

    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    selectedCollectionsForDeletion,
  } = useCollections();

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-500">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <div className="w-full sm:max-w-md mx-auto px-5 sm:px-5 md:px-3 py-3 sm:py-4 bg-primary-500 mt-8">
          <div className="flex flex-col text-white w-full ">
            <h1 className="text-2xl sm:text-2xl md:text-3xl mb-2 font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%]">
              Tus colecciones
            </h1>
            <p className="text-base sm:text-sm md:text-md mb-4 sm:mb-6 font-[var(--font-lato),sans-serif]">
              Organiza tus prendas por colecciones, temporadas, años...
            </p>
          </div>
          <SearchBar
            placeholder="Buscar material..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
          <div className="w-full max-w-xs sm:max-w-sm mx-auto">
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                <p className="text-gray-600 mt-4">Cargando colecciones...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">
                  Error al cargar colecciones: {error.message}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-red-600 underline text-sm mt-2 hover:text-red-700"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <>
                {filteredCollections.length === 0 && !isCreatingMode ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      {searchQuery
                        ? "No se encontraron colecciones"
                        : "Aún no tienes colecciones"}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={startCreatingMode}
                        className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                      >
                        Crear primera colección
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-4 sm:gap-y-5 md:gap-y-6 mb-6 sm:mb-8">
                    {isCreatingMode && (
                      <CreateCollectionInput
                        value={newCollectionName}
                        onChange={handleNewCollectionNameChange}
                        onKeyDown={createCollection}
                        isCreating={isCreating}
                        onCancel={cancelCreatingMode}
                      />
                    )}

                    {filteredCollections.map((collection) => (
                      <div key={collection.id} className="relative">
                        <CollectionButton
                          title={collection.nombre}
                          subtitle=""
                          isActive={selectedCollection === collection.id}
                          onClick={() => {
                            if (isDeleteMode) {
                              toggleCollectionForDeletion(collection.id);
                            } else {
                              handleCollectionToggle(collection.id);
                            }
                          }}
                          className={
                            collectionsToDelete.has(collection.id)
                              ? "ring-2 ring-red-500 bg-red-100"
                              : ""
                          }
                        />

                        {isDeleteMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCollectionForDeletion(collection.id);
                              openDeleteModal();
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white opacity-75 rounded-full flex items-center justify-center text-secondary-600 text-xs font-bold hover:bg-red-600 transition-colors shadow-md z-10"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <BtnActionsCollections.default
        collectionsToDelete={collectionsToDelete}
        isDeleteMode={isDeleteMode}
        toggleDeleteMode={toggleDeleteMode}
        confirmDeletion={openDeleteModal}
        onAddCollection={startCreatingMode}
      />

      <DeleteCollectionModal
        isOpen={showDeleteModal}
        collectionsToDelete={selectedCollectionsForDeletion}
        onConfirm={confirmDeletion}
        onCancel={closeDeleteModal}
        toggleDeleteMode={toggleDeleteMode}
        isDeleting={isDeleting}
      />

      <Footer />
    </div>
  );
}
