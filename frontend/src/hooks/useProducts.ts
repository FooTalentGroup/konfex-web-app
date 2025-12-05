'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/product.service';
import { Product } from '@/types/IProduct';

interface UseProductsOptions {
    collectionId?: number; 
}

export const useProducts = (options?: UseProductsOptions) => {
    const router = useRouter();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        fetchProducts();
    }, [options?.collectionId]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            let data: Product[];
            
            if (options?.collectionId) {
                data = await productService.getByCollection(options.collectionId);
            } else {
                data = await productService.getAll();
            }
            
            setProducts(data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            console.error('Error al cargar productos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        
        const searchTerm = searchQuery.toLowerCase();
        return products.filter((product) =>
            product.nombre.toLowerCase().includes(searchTerm) ||
            product.colores.some(color => color.toLowerCase().includes(searchTerm)) ||
            product.tallas.some(talla => talla.toLowerCase().includes(searchTerm)) ||
            product.descripcion.toLowerCase().includes(searchTerm)
        );
    }, [products, searchQuery]);

    const handleProductClick = (productId: number) => {
        router.push(`/productos/${productId}`);
    };

    const handleAddProduct = (collectionId?: number) => {
        if (collectionId) {
            router.push(`/productos/crear?coleccionId=${collectionId}`);
        } else {
            router.push('/productos/crear');
        }
    };

    return {
        products,
        filteredProducts,
        isLoading,
        error,
        searchQuery,
        
        handleSearch,
        handleProductClick,
        handleAddProduct,
        fetchProducts,
    };
};