import { useState, useMemo } from 'react';

export interface Material {
  id: string;
  name: string;
  category: 'tela' | 'botones' | 'hilos' | 'otros';
  quantity: number;
  unit: string;
  color?: string;
  colors?: string[];
  measure?: string;
  price?: string;
  imageUrl?: string;
}

const mockMaterials: Material[] = [
  { id: '1', name: 'Algodón Premium', category: 'tela', quantity: 50, unit: 'metros', color: 'Blanco' },
  { id: '2', name: 'Seda Natural', category: 'tela', quantity: 25, unit: 'metros', color: 'Beige' },
  { id: '3', name: 'Lino Orgánico', category: 'tela', quantity: 30, unit: 'metros', color: 'Natural' },
  { id: '4', name: 'Botones de Madera', category: 'botones', quantity: 100, unit: 'unidades', color: 'Marrón' },
  { id: '5', name: 'Botones de Perla', category: 'botones', quantity: 50, unit: 'unidades', color: 'Blanco' },
  { id: '6', name: 'Hilo de Algodón', category: 'hilos', quantity: 20, unit: 'carretes', color: 'Negro' },
  { id: '7', name: 'Hilo de Poliéster', category: 'hilos', quantity: 15, unit: 'carretes', color: 'Blanco' },
  { id: '8', name: 'Cremallera Metálica', category: 'otros', quantity: 10, unit: 'unidades', color: 'Plateado' },
];

export const mockFabricMaterials: Material[] = [
  {
    id: 'f1',
    name: 'Jersey de Algodón',
    category: 'tela',
    quantity: 1.7,
    unit: 'metros',
    colors: ['azul', 'rosa', 'amarillo'],
    measure: '1.7mt',
    price: '0000000',
    imageUrl: '/telass.png',
  },
  {
    id: 'f2',
    name: 'Jersey de Algodón',
    category: 'tela',
    quantity: 1.7,
    unit: 'metros',
    colors: ['azul', 'rosa', 'amarillo'],
    measure: '1.7mt',
    price: '0000000',
    imageUrl: '/telass.png',
  },
  {
    id: 'f3',
    name: 'Jersey de Algodón',
    category: 'tela',
    quantity: 1.7,
    unit: 'metros',
    colors: ['azul', 'rosa', 'amarillo'],
    measure: '1.7mt',
    price: '0000000',
    imageUrl: '/telass.png',
  },
  {
    id: 'f4',
    name: 'Jersey de Algodón',
    category: 'tela',
    quantity: 1.7,
    unit: 'metros',
    colors: ['azul', 'rosa', 'amarillo'],
    measure: '1.7mt',
    price: '0000000',
    imageUrl: '/telass.png',
  },
  {
    id: 'f5',
    name: 'Jersey de Algodón',
    category: 'tela',
    quantity: 1.7,
    unit: 'metros',
    colors: ['azul', 'rosa', 'amarillo'],
    measure: '1.7mt',
    price: '0000000',
    imageUrl: '/telass.png',
  },
];

export const useMaterials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    let filtered = mockMaterials;

    if (selectedCategory) {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.color?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleAddMaterial = () => {
    console.log('Agregar material');
  };

  const handleUploadPDF = () => {
    console.log('Subir PDF');
  };

  const [fabricSearchQuery, setFabricSearchQuery] = useState('');

  const filteredFabricMaterials = useMemo(() => {
    if (!fabricSearchQuery.trim()) {
      return mockFabricMaterials;
    }
    const searchTerm = fabricSearchQuery.toLowerCase();
    return mockFabricMaterials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchTerm) ||
        material.colors?.some((color) => color.toLowerCase().includes(searchTerm)) ||
        material.price?.toLowerCase().includes(searchTerm)
    );
  }, [fabricSearchQuery]);

  const handleFabricSearch = (value: string) => {
    setFabricSearchQuery(value);
  };

  const handleMaterialClick = (materialId: string) => {
    console.log('Material clicked:', materialId);
  };

  return {
    materials: filteredMaterials,
    fabricMaterials: mockFabricMaterials,
    filteredFabricMaterials,
    searchQuery,
    fabricSearchQuery,
    selectedCategory,
    handleSearch,
    handleFabricSearch,
    handleCategorySelect,
    handleCategoryToggle,
    handleAddMaterial,
    handleUploadPDF,
    handleMaterialClick,
  };
};

