"use client";
import React from 'react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import { useAuth, useSidebar } from '@/hooks';
import BackNavigationBar from './BackNavigationBar';
import GarmentForm from './GarmentForm';

interface AddGarmentTemplateProps {
    collectionId?: number; 
}

export default function AddGarmentTemplate({ collectionId }: AddGarmentTemplateProps) {
    const { user, mounted } = useAuth();
    const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar();


    if (!mounted && !user) return null;

    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            <Header onMenuClick={openSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className='flex-1 sm:p-6'>
                <div className='max-w-3xl mx-auto bg-[#E6E1EA] shadow-md rounded-lg'>
                    <BackNavigationBar
                        title="Prenda nueva"
                        breadcrumbs={[
                            { label: 'Tus colecciones' }
                        ]}
                    />

                    <GarmentForm collectionId={collectionId}/>
                </div>
            </main>
        </div>
    );
}
