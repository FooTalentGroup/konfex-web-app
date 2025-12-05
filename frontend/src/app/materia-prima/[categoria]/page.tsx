'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import BackNavigationBar from '@/components/common/BackNavigationBar';
import SearchBarWhite from '@/components/common/SearchBarWhite';
import MaterialCard from '@/components/common/MaterialCard';
import AddFloatingButton from '@/components/common/AddFloatingButton';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useMaterials } from '@/hooks/useMaterials';
import { useCategories } from '@/hooks/useCategories';

export default function CategoriaPage() {
    const router = useRouter();
    const params = useParams();
    const categoria = params.categoria as string;

    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

    // Obtener las categorías disponibles
    const { categories, isLoading: isLoadingCategories } = useCategories();

    // DEBUG - AGREGAR ESTO
    console.log('=== DEBUG CategoriaPage ===');
    console.log('Categoria param:', categoria);
    console.log('isLoadingCategories:', isLoadingCategories);
    console.log('Categories:', categories);
    console.log('Categories slugs:', categories.map(c => c.slug));

    // Buscar la categoría actual en las categorías disponibles
    const currentCategory = categories.find(cat => cat.slug === categoria);

    console.log('Current category found:', currentCategory);
    console.log('===========================');

    // Usar el nombre de la categoría del backend directamente
    const categoriaBackend = currentCategory?.nombre;

    const {
        filteredFabricMaterials,
        fabricSearchQuery,
        isLoading,
        error,
        handleFabricSearch,
        handleMaterialClick,
    } = useMaterials(categoriaBackend);

    const handleAddMaterial = () => {
        router.push(`/materia-prima/${categoria}/crear`);
    };

    // Redirigir si la categoría no existe (después de cargar)
    useEffect(() => {
        console.log('useEffect redirect - isLoadingCategories:', isLoadingCategories, 'currentCategory:', currentCategory);

        if (!isLoadingCategories && categories.length > 0 && !currentCategory) {
            console.log('REDIRIGIENDO a /materia-prima');
            router.push('/materia-prima');
        }
    }, [isLoadingCategories, categories, currentCategory, router]);

    if (!mounted) {
        return null;
    }

    if (!user) {
        return null;
    }

    // Mostrar loading mientras se cargan las categorías
    if (isLoadingCategories) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E1EA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando categorías...</p>
                </div>
            </div>
        );
    }

    // Si la categoría no existe después de cargar, mostrar loading mientras redirige
    if (!currentCategory && categories.length > 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E1EA]">
                <div className="text-center">
                    <p className="text-gray-600">Categoría "{categoria}" no encontrada, redirigiendo...</p>
                    <p className="text-sm text-gray-500 mt-2">Categorías disponibles: {categories.map(c => c.slug).join(', ')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
            <Header onMenuClick={openSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col">
                <BackNavigationBar
                    title={currentCategory.nombre}
                    breadcrumbs={[{ label: 'Tus materiales' }]}
                />

                <div className="bg-[#E6E1EA] rounded-t-2xl py-3 sm:py-4 md:py-5 flex-1">
                    <div className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-xs sm:max-w-sm mx-auto">
                        <div className="mb-3 sm:mb-4 md:mb-5 pt-3 sm:pt-4 md:pt-5">
                            <SearchBarWhite
                                placeholder="Buscar color, precio...."
                                value={fabricSearchQuery}
                                onChange={handleFabricSearch}
                            />
                        </div>

                        {/* Estado de Loading */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        )}

                        {/* Estado de Error */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Lista de Materiales */}
                        {!isLoading && !error && (
                            <>
                                {filteredFabricMaterials.length === 0 ? (
                                    <div className="text-center py-10 text-gray-600">
                                        No se encontraron materiales en esta categoría
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-5 md:pb-6">
                                        {filteredFabricMaterials.map((material) => (
                                            <MaterialCard
                                                key={material.id}
                                                id={material.id}
                                                name={material.name}
                                                colors={material.colors}
                                                measure={material.measure}
                                                price={material.price}
                                                imageUrl={material.imageUrl}
                                                onClick={() => handleMaterialClick(material.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pt-4 sm:pt-5 md:pt-6 pb-6 sm:pb-8 md:pb-10">
                            <AddFloatingButton onClick={handleAddMaterial} isStatic={true} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}