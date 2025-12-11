'use client';

import { useEffect, useState, useMemo } from 'react';

export function useMaterialsByCategory(categoryId?: number) {
    const [materials, setMaterials] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!categoryId) {
            setIsLoading(false);
            return;
        }

        const fetchMaterials = async () => {
            setIsLoading(true);
            setError('');

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/categorias/${categoryId}/materiales`
                );

                const json = await res.json();

                if (!json.success) {
                    throw new Error(json.message || 'Error obteniendo materiales');
                }


                setMaterials(json.data.data || []);
            } catch (err: any) {
                setError(err.message ?? 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, [categoryId]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const filteredMaterials = useMemo(() => {
        if (!searchQuery.trim()) {
            return materials;
        }

        const query = searchQuery.toLowerCase();

        return materials.filter((m: any) => {
            const name = m.nombre?.toLowerCase() || '';
            const colors = (m.colores || []).join(' ').toLowerCase();
            const price = m.precio?.toString() || '';
            return name.includes(query) || colors.includes(query) || price.includes(query);
        });
    }, [materials, searchQuery]);

    const handleMaterialClick = (id: number) => {
    };

    return {
        materials: filteredMaterials,
        searchQuery,
        isLoading,
        error,
        handleSearch,
        handleMaterialClick,
    };
}