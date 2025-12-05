'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collectionService } from '@/services/collection.service';
import { Collection } from '@/types/ICollections';

export interface Garment {
  id: string;
  name: string;
  color: string;
  size: string;
  price: string;
  imageUrl: string;
  collectionId: string;
}

const MOCK_GARMENTS: Garment[] = [
  {
    id: 'g1',
    name: 'Camiseta Lemon',
    color: 'azul, rosa...',
    size: 'S - L',
    price: '20.000',
    imageUrl: '/prenda-coleccion-2.png',
    collectionId: '1',
  },
  {
    id: 'g2',
    name: 'Pupera Fly',
    color: 'negro',
    size: 'S - L',
    price: '20.000',
    imageUrl: '/prenda-coleccion-1.png',
    collectionId: '1',
  },
  {
    id: 'g3',
    name: 'Camiseta Lemon',
    color: 'azul, rosa...',
    size: 'S - L',
    price: '20.000',
    imageUrl: '/prenda-coleccion-2.png',
    collectionId: '1',
  },
  {
    id: 'g4',
    name: 'Pupera Fly',
    color: 'negro',
    size: 'S - L',
    price: '20.000',
    imageUrl: '/prenda-coleccion-1.png',
    collectionId: '1',
  },
  {
    id: 'g5',
    name: 'Pupera Fly',
    color: 'negro',
    size: 'S - L',
    price: '20.000',
    imageUrl: '/prenda-coleccion-1.png',
    collectionId: '1',
  },
];

export const useCollections = () => {
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [collectionsToDelete, setCollectionsToDelete] = useState<Set<number>>(new Set());

  const [garmentSearchQuery, setGarmentSearchQuery] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      console.error('Error al cargar colecciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCollectionToggle = (collectionId: number) => {
    setSelectedCollection(
      selectedCollection === collectionId ? null : collectionId
    );

    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      const slug = collection.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

      router.push(`/colecciones/${slug}?id=${collectionId}`);
    }
  };

  const handleAddCollection = () => {
    router.push('/colecciones/crear');
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    if (isDeleteMode) {
      setCollectionsToDelete(new Set());
    }
  };

  const toggleCollectionForDeletion = (collectionId: number) => {
    setCollectionsToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const confirmDeletion = async () => {
    if (collectionsToDelete.size === 0) return;

    try {
      await Promise.all(
        Array.from(collectionsToDelete).map(id =>
          collectionService.delete(id)
        )
      );

      await fetchCollections();

      setCollectionsToDelete(new Set());
      setIsDeleteMode(false);

      alert(`${collectionsToDelete.size} colección(es) eliminada(s) exitosamente`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al eliminar');
      alert(`Error: ${error.message}`);
    }
  };

  const createCollection = async (nombre: string, imagen?: string, icono?: string) => {
    try {
      const newCollection = await collectionService.create({
        nombre,
        imagen,
        icono,
      });

      setCollections(prev => [newCollection, ...prev]);

      return newCollection;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al crear');
      throw error;
    }
  };

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;

    const searchTerm = searchQuery.toLowerCase();
    return collections.filter((collection) =>
      collection.nombre.toLowerCase().includes(searchTerm)
    );
  }, [collections, searchQuery]);


  const handleGarmentSearch = (value: string) => {
    setGarmentSearchQuery(value);
  };

  const handleGarmentClick = (garmentId: string) => {
    console.log('Garment clicked:', garmentId);
  };

  const handleAddGarment = () => {
    router.push('verano/crear-prenda');
  };

  const filteredGarments = useMemo(() => {
    if (!garmentSearchQuery.trim()) {
      return MOCK_GARMENTS;
    }
    const searchTerm = garmentSearchQuery.toLowerCase();
    return MOCK_GARMENTS.filter(
      (garment) =>
        garment.name.toLowerCase().includes(searchTerm) ||
        garment.color.toLowerCase().includes(searchTerm) ||
        garment.price.toLowerCase().includes(searchTerm)
    );
  }, [garmentSearchQuery]);

  return {
    collections,
    filteredCollections,
    isLoading,
    error,

    searchQuery,
    selectedCollection,

    isDeleteMode,
    collectionsToDelete,

    garments: MOCK_GARMENTS,
    filteredGarments,
    garmentSearchQuery,

    handleSearch,
    handleCollectionToggle,
    handleAddCollection,
    fetchCollections,
    createCollection,

    toggleDeleteMode,
    toggleCollectionForDeletion,
    confirmDeletion,

    handleGarmentSearch,
    handleGarmentClick,
    handleAddGarment,
  };
};