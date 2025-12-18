import { useState, useEffect } from 'react';
import { Material } from '@/types/IFabric';
import { materialService } from '@/services/material.service';

export const useMaterials = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                setIsLoading(true);
                const data = await materialService.getAll();
                setMaterials(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar materiales');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    return { materials, isLoading, error };
};
