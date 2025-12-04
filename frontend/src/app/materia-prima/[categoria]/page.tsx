'use client';

import React from 'react';
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

// Mapeo de categorías
const CATEGORY_MAP: Record<string, { backend: string; display: string }> = {
    'tela': { backend: 'Tela', display: 'Tela' },
    'botones': { backend: 'Botones', display: 'Botones' },
    'hilos': { backend: 'Hilo', display: 'Hilos' },
    'otros': { backend: 'Otros', display: 'Otros' },
};

export default function CategoriaPage() {
    const router = useRouter();
    const params = useParams();
    const categoria = params.categoria as string;

    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();

    // Obtener el nombre de categoría para el backend
    const categoryInfo = CATEGORY_MAP[categoria];
    const categoriaBackend = categoryInfo?.backend;

    const {
        filteredFabricMaterials,
        fabricSearchQuery,
        isLoading,
        error,
        handleFabricSearch,
        handleMaterialClick,
    } = useMaterials(categoriaBackend); // Pasar la categoría al hook

    const handleAddMaterial = () => {
        router.push(`/materia-prima/${categoria}/crear`);
    };

    if (!mounted) {
        return null;
    }

    if (!user) {
        return null;
    }

    // Si la categoría no existe, redirigir
    if (!categoryInfo) {
        router.push('/materia-prima');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#E6E1EA]">
            <Header onMenuClick={openSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className="flex-1 flex flex-col">
                <BackNavigationBar
                    title={categoryInfo.display}
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