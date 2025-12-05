'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collectionService } from '@/services/collection.service';
import { Collection } from '@/types/ICollections';

interface UseCollectionsOptions {
  collectionId?: number | string;
  autoFetch?: boolean;
}

export const useCollections = (options?: UseCollectionsOptions) => {
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  const [collectionError, setCollectionError] = useState<Error | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [collectionsToDelete, setCollectionsToDelete] = useState<Set<number>>(new Set());

  useEffect(() => {
    const autoFetch = options?.autoFetch !== false;

    if (!autoFetch) return;

    if (options?.collectionId) {
      fetchCollectionById(options.collectionId);
    } else {
      fetchCollections();
    }
  }, [options?.collectionId, options?.autoFetch]);

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

  const fetchCollectionById = async (id: number | string) => {
    setIsLoadingCollection(true);
    setCollectionError(null);

    try {
      const numericId = typeof id === 'string' ? id : id;
      const collection = await collectionService.getById(String(numericId));
      setCurrentCollection(collection);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al cargar colección');
      setCollectionError(error);
      console.error('Error al cargar colección:', error);
    } finally {
      setIsLoadingCollection(false);
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



  return {
    collections,
    filteredCollections,
    isLoading,
    error,

    currentCollection,
    isLoadingCollection,
    collectionError,

    searchQuery,
    selectedCollection,

    isDeleteMode,
    collectionsToDelete,

    handleSearch,
    handleCollectionToggle,
    handleAddCollection,
    fetchCollections,
    createCollection,

    toggleDeleteMode,
    toggleCollectionForDeletion,
    confirmDeletion,

  };
};