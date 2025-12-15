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
import { useCategories } from '@/hooks/useCategories';
import { useMaterialsByCategory, MaterialItem } from '@/hooks/useMaterialsByCategory';

export default function CategoriaPage() {
    const router = useRouter();
    const params = useParams();

    // Convertir params.categoria a string
    const categoria = Array.isArray(params.categoria)
        ? params.categoria[0]
        : (params.categoria as string) || '';

    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

    const { categories, isLoading: isLoadingCategories } = useCategories();

    // Buscar la categoría actual por slug
    const currentCategory = categories.find((c) => c.slug === categoria);

    // Usar el ID numérico de la categoría
    const {
        materials,
        searchQuery,
        isLoading,
        error,
        handleSearch,
    } = useMaterialsByCategory(currentCategory?.id);

    // Redirigir si la categoría no existe
    useEffect(() => {
        if (!isLoadingCategories && categories.length > 0 && categoria && !currentCategory) {
            router.push('/materia-prima');
        }
    }, [isLoadingCategories, categories, currentCategory, categoria, router]);

    if (!mounted || !user) {
        return null;
    }

    // Loading de categorías
    if (isLoadingCategories || !categoria) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E1EA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando categoría...</p>
                </div>
            </div>
        );
    }

    // Si la categoría no existe después de cargar
    if (!currentCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E6E1EA]">
                <div className="text-center">
                    <p className="text-gray-600">
                        Categoría {`"${categoria}"`} no encontrada, redirigiendo...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Categorías disponibles: {categories.map(c => c.slug).join(', ')}
                    </p>
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

                <div className="bg-[#E6E1EA] rounded-t-2xl py-4 flex-1">
                    <div className="w-[calc(100%-2rem)] max-w-sm mx-auto">
                        <div className="mb-4 pt-4">
                            <SearchBarWhite
                                placeholder="Buscar color, precio...."
                                value={searchQuery}
                                onChange={handleSearch}
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
                                {!Array.isArray(materials) || materials.length === 0 ? (
                                    <div className="text-center py-10 text-gray-600">
                                        No se encontraron materiales en esta categoría
                                    </div>
                                ) : (
                                    <div className="space-y-3 pb-6">
                                        {materials.map((material: MaterialItem) => (
                                            <MaterialCard
                                                key={material.id}
                                                id={material.id}
                                                name={material.nombre}
                                                colors={material.colores}
                                                measure={material.ancho ? `${material.ancho}cm` : undefined}
                                                price={`$${material.precio.toFixed(2)}`}
                                                imageUrl={material.url_imagen}
                                                onClick={() => router.push(`/materia-prima/${categoria}/${material.id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pt-4 pb-10">
                            <AddFloatingButton
                                onClick={() => router.push(`/materia-prima/${categoria}/crear`)}
                                isStatic={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}