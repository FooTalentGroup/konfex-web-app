'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import BackNavigationBar from '@/components/common/BackNavigationBar';
import SearchBarWhite from '@/components/common/SearchBarWhite';
import ProductCard from '@/components/common/ProductCard';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useProducts } from '@/hooks/useProducts';
import { useCollections } from '@/hooks';
import BtnActionsProducts from '@/components/ui/BtnActionsProducts';

export default function CollectionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');

  const { user, mounted } = useAuth();
  const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

  const {
    currentCollection,
    isLoadingCollection,
    collectionError,
  } = useCollections({
    collectionId: collectionId || undefined,
  });

  const {
    filteredProducts,
    isLoading: isLoadingProducts,
    error: productsError,
    searchQuery,
    handleSearch,
    handleAddProduct,
  } = useProducts({
    collectionId: collectionId ? Number(collectionId) : undefined
  });


  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isLoadingCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6E1EA]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Cargando colección...</p>
        </div>
      </div>
    );
  }

  if (collectionError || !currentCollection) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
        <Header onMenuClick={openSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-gray-600 text-lg mb-4">
              {collectionError?.message || 'Colección no encontrada'}
            </p>
            <button
              onClick={() => router.push('/colecciones')}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Volver a Colecciones
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <BackNavigationBar
          title={currentCollection.nombre}
          breadcrumbs={[
            { label: 'Tus colecciones', href: '/colecciones' }
          ]}
        />

        <div className="bg-[#E6E1EA] rounded-t-2xl py-3 sm:py-4 md:py-5 flex-1">
          <div className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-xs sm:max-w-sm mx-auto">

            <div className="mb-3 sm:mb-4 md:mb-5 pt-3 sm:pt-4 md:pt-5">
              <SearchBarWhite
                placeholder="Buscar color, precio..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {isLoadingProducts && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                <p className="text-gray-600 mt-4">Cargando productos...</p>
              </div>
            )}

            {productsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">
                  Error al cargar productos: {productsError.message}
                </p>
              </div>
            )}

            {!isLoadingProducts && !productsError && (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      {searchQuery
                        ? 'No se encontraron productos'
                        : 'Aún no tienes productos en esta colección'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => handleAddProduct(currentCollection.id)}
                        className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                      >
                        Agregar primer producto
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-5 md:pb-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        nombre={product.nombre}
                        colores={product.colores}
                        tallas={product.tallas}
                        precio={product.precio}
                        imagen={product.imagen}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <BtnActionsProducts
        isDeleteMode={false}
        onAddProduct={() => handleAddProduct(currentCollection.id)}
      />
      <Footer />
    </div>
  );
}