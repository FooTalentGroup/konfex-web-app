'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
}

export interface Garment {
  id: string;
  name: string;
  color: string;
  size: string;
  price: string;
  imageUrl: string;
  collectionId: string;
}

// Data mockeada de colecciones
const MOCK_COLLECTIONS: Collection[] = [
  { id: '1', title: 'Verano', subtitle: '2025' },
  { id: '2', title: 'Primavera', subtitle: '2024' },
  { id: '3', title: 'Casual', subtitle: '2024 - 2025' },
];

// Data mockeada de prendas
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collections] = useState<Collection[]>(MOCK_COLLECTIONS);

  const [garmentSearchQuery, setGarmentSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollection(
      selectedCollection === collectionId ? null : collectionId
    );
    
    if (collectionId === '1') {
      router.push('/colecciones/verano');
    }

    // if (collectionId === '2') router.push('/primavera');
    // if (collectionId === '3') router.push('/casual');
  };

  const handleAddCollection = () => {
    console.log('Navegar a crear colección');
    // router.push('/collections/create');
  };

  const handleGarmentSearch = (value: string) => {
    setGarmentSearchQuery(value);
  };

  const handleGarmentClick = (garmentId: string) => {
    console.log('Garment clicked:', garmentId);
  };

  const handleAddGarment = () => {
    router.push('verano/crear-prenda');
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((collection) =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collections, searchQuery]);

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
    searchQuery,
    selectedCollection,
    collections,
    filteredCollections,
    
    garments: MOCK_GARMENTS,
    filteredGarments,
    garmentSearchQuery,
    
    handleSearch,
    handleCollectionToggle,
    handleAddCollection,
    
    handleGarmentSearch,
    handleGarmentClick,
    handleAddGarment,
  };
};