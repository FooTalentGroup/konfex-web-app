import { useState, useEffect } from 'react';

export interface Category {
    id: string;
    nombre: string;
    slug: string;
    iconPath: string;
}

interface BackendMaterial {
    id: number;
    nombre: string;
    categoria: string;
    // ... otros campos
}

interface BackendResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        data: BackendMaterial[];
        pagination: any;
    };
}

// Mapeo de categorías a sus iconos
const CATEGORY_ICON_MAP: Record<string, string> = {
    'Tela': '/imageTela.png',
    'Hilo': '/hilos.png',
    'Botones': '/botones.png',
    'Boton': '/botones.png',
    'Hilos': '/hilos.png',
};

// Mapeo de categorías a sus slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
    'Tela': 'tela',
    'Hilo': 'hilos',
    'Hilos': 'hilos',
    'Botones': 'botones',
    'Boton': 'botones',
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/materiales`;
            console.log('Fetching materials to extract categories from:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error al cargar los materiales');
            }

            const result: BackendResponse = await response.json();
            console.log('Materials result:', result);

            if (result.data && Array.isArray(result.data.data)) {
                // Extraer categorías únicas
                const uniqueCategories = new Set<string>();
                result.data.data.forEach((material) => {
                    if (material.categoria) {
                        uniqueCategories.add(material.categoria);
                    }
                });

                console.log('Unique categories found:', Array.from(uniqueCategories));

                // Mapear a formato de categorías
                const mappedCategories: Category[] = Array.from(uniqueCategories).map((catName, index) => ({
                    id: `cat-${index}`, // ID temporal basado en el nombre
                    nombre: catName,
                    slug: CATEGORY_SLUG_MAP[catName] || catName.toLowerCase(),
                    iconPath: CATEGORY_ICON_MAP[catName] || '/agregar.png',
                }));

                setCategories(mappedCategories);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            console.error('Error fetching categories:', err);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategory = async (categoryName: string) => {
        // Como no hay endpoint de categorías, simular la eliminación
        // En realidad, esto debería eliminar todos los materiales de esa categoría
        console.warn('No hay endpoint para eliminar categorías. Categoría:', categoryName);
        return false;
    };

    const deleteMultipleCategories = async (categoryIds: string[]) => {
        // Obtener los nombres de las categorías desde los IDs
        const categoriesToDelete = categories
            .filter(cat => categoryIds.includes(cat.id))
            .map(cat => cat.nombre);

        console.warn('No hay endpoint para eliminar categorías. Categorías:', categoriesToDelete);

        // TODO: Cuando tengas el endpoint, deberías eliminar todos los materiales de estas categorías
        // O mostrar un mensaje diciendo que no se pueden eliminar categorías que tienen materiales

        return false;
    };

    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        deleteCategory,
        deleteMultipleCategories,
    };
};