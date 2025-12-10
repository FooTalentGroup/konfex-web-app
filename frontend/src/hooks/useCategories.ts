'use client';

import { useState, useCallback, useEffect } from 'react';

interface Category {
    id: number;
    nombre: string;
    slug: string;
    iconPath?: string;
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
            const json = await res.json();

            if (!json.success) {
                throw new Error(json.message || 'Error fetching categories');
            }

            // Mapear y agregar slug a cada categoría
            const mappedCategories = (json.data || []).map((cat: any) => ({
                id: cat.id,
                nombre: cat.nombre,
                slug: generateSlug(cat.nombre),
            }));

            setCategories(mappedCategories);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

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

        } catch (err: any) {
            return {
                success: false,
                error: err.message ?? 'Error desconocido'
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

        } catch (err) {
            return false;
        }
    }, [fetchCategories]);



    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        deleteCategory,
        addCategory,
    };
}