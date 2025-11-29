'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar';
import CollectionButton from '@/components/common/CollectionButton';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { useCollections } from '@/hooks/useCollections';

export default function CollectionsPage() {
    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();
    const router = useRouter();
    const {
        searchQuery,
        selectedCollection,
        filteredCollections,
        handleSearch,
        collections,
        handleCollectionToggle,
        handleAddCollection,
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
                <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-primary-500 mt-8">
                    <div className='flex flex-col text-white max-w-xs sm:max-w-md md:max-w-2xl mx-auto'>
                        <h1 className="text-lg sm:text-xl md:text-2xl mb-2 font-[var(--font-lato),sans-serif] font-bold leading-[131%] tracking-[0%]">
                            Tus colecciones
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 font-[var(--font-lato),sans-serif]">
                            Organiza tus prendas por colecciones, temporadas, años...
                        </p>
                    </div>
                    <SearchBar
                        placeholder="Buscar material..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="max-w-xs sm:max-w-md md:max-w-2xl mx-auto"
                    />
                </div>

                <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
                    <div className="w-full max-w-xs sm:max-w-sm mx-auto">

                        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-4 sm:gap-y-5 md:gap-y-6 mb-6 sm:mb-8">
                            {filteredCollections.map((collection) => (
                                <CollectionButton
                                    key={collection.id}
                                    title={collection.title}
                                    subtitle={collection.subtitle}
                                    isActive={selectedCollection === collection.id}
                                    onClick={() => handleCollectionToggle(collection.id)}
                                />
                            ))}

                            <CollectionButton
                                title="Agregar colección"
                                subtitle=""
                                icon={<Plus className="w-6 h-6 text-secondary-500" />}
                                onClick={handleAddCollection}
                            />
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}