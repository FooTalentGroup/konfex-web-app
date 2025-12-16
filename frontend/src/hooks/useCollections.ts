'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collectionService } from '@/services/collection.service';
import { Collection } from '@/types/ICollections';
import { useToast } from '@/contexts/ToastContext';

interface UseCollectionsOptions {
  collectionId?: number | string;
  autoFetch?: boolean;
}

export const useCollections = (options?: UseCollectionsOptions) => {
  const router = useRouter();
  const toast = useToast();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  const [collectionError, setCollectionError] = useState<Error | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);

  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

      router.push(`/collections/${slug}?id=${collectionId}`);
    }
  };

  const startCreatingMode = () => {
    setIsCreatingMode(true);
    setNewCollectionName('');
  };

  const cancelCreatingMode = () => {
    setIsCreatingMode(false);
    setNewCollectionName('');
  };

  const handleNewCollectionNameChange = (name: string) => {
    setNewCollectionName(name);
  };

  const handleAddCollection = () => {
    router.push('/collections/create');
  };

  const toggleDeleteMode = () => {
    const newMode = !isDeleteMode;
    setIsDeleteMode(newMode);
    if (!newMode) {
      setCollectionsToDelete(new Set());
      setShowDeleteModal(false);
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

  const openDeleteModal = () => {
    if (collectionsToDelete.size > 0) return;
    setShowDeleteModal(true);
  };

   const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDeletion = async () => {
    if (collectionsToDelete.size === 0) return;

    setIsDeleting(true);

    try {
      await Promise.all(
        Array.from(collectionsToDelete).map(id =>
          collectionService.delete(id)
        )
      );

      await fetchCollections();

      setCollectionsToDelete(new Set());
      setIsDeleteMode(false);
      setShowDeleteModal(false);

      toast.showSuccess(`${collectionsToDelete.size} colección(es) eliminada(s) exitosamente`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al eliminar');
      toast.showError(`Error: ${error.message}`);
    } finally {
      setIsDeleteMode(false);
    }
  };

  const createCollection = async (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;

    if (!newCollectionName.trim()) {
      toast.showWarning('Por favor ingresa un nombre para la colección');
      return;
    }

    setIsCreating(true);

    try {
      const newCollection = await collectionService.create({
        nombre: newCollectionName.trim(),
        imagen: 'https://example.com/imagen-coleccion.jpg',
        icono: 'https://example.com/icono-coleccion.jpg',
      });

      setCollections(prev => [newCollection, ...prev]);
      setIsCreatingMode(false);
      setNewCollectionName('');
      toast.showSuccess('Colección creada exitosamente');

      return newCollection;


    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al crear');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;

    const searchTerm = searchQuery.toLowerCase();
    return collections.filter((collection) =>
      collection.nombre.toLowerCase().includes(searchTerm)
    );
  }, [collections, searchQuery]);

  const selectedCollectionsForDeletion = useMemo(() => {
    return collections.filter(c => collectionsToDelete.has(c.id));
  }, [collections, collectionsToDelete]);


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

    showDeleteModal,
    isDeleteMode,
    isDeleting,
    selectedCollectionsForDeletion,
    collectionsToDelete,

    handleSearch,
    handleCollectionToggle,
    handleAddCollection,
    fetchCollections,
    fetchCollectionById,

    isCreatingMode,
    newCollectionName,
    isCreating,
    startCreatingMode,
    cancelCreatingMode,
    handleNewCollectionNameChange,
    createCollection,

    toggleDeleteMode,
    toggleCollectionForDeletion,
    confirmDeletion,

    openDeleteModal,
    closeDeleteModal,

  };
};
