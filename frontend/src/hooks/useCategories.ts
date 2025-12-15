'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

interface Category {
    id: number;
    nombre: string;
    slug: string;
    iconPath?: string;
}

interface ApiCategory {
    id: number;
    nombre: string;
}

// Generar slug desde el nombre
const generateSlug = (nombre: string): string => {
    return nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
            const json: { success: boolean; message?: string; data?: ApiCategory[] } = await res.json();

            if (!json.success) {
                throw new Error(json.message || 'Error fetching categories');
            }

            // Mapear y agregar slug a cada categoría
            const mappedCategories = (json.data || []).map((cat: ApiCategory) => ({
                id: cat.id,
                nombre: cat.nombre,
                slug: generateSlug(cat.nombre),
            }));

            setCategories(mappedCategories);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error obteniendo categorías';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = useMemo(() => {
        if(searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return categories.filter(c => c.nombre.toLowerCase().includes(q));
        }
        return categories;
    }, [categories, searchQuery]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const addCategory = useCallback(async (nombre: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            const json = await res.json();

            if (!json.success) {
                return { success: false, error: json.message || 'Error creando categoría' };
            }

            await fetchCategories();
            return { success: true };

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            return {
                success: false,
                error: message
            };
        }
    }, [fetchCategories]);


    const deleteCategory = useCallback(async (id: string | number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias/${id}`, {
                method: 'DELETE'
            });

            if (res.status === 204) {
                await fetchCategories();
                return true;
            }

            if (res.status === 400 || res.status === 404) {
                const json = await res.json().catch(() => ({}));
                return false;
            }
            return false;

        } catch (_err: unknown) {
            return false;
        }
    }, [fetchCategories]);



    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        deleteCategory,
        addCategory,

        filteredCategories,
        searchQuery,
        handleSearch
    };
}