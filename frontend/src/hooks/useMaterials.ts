import { useState, useMemo } from 'react';

export interface Material {
  id: string;
  name: string;
  category: 'tela' | 'botones' | 'hilos' | 'otros';
  quantity: number;
  unit: string;
  color?: string;
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

  return {
    materials: filteredMaterials,
    searchQuery,
    selectedCategory,
    handleSearch,
    handleCategorySelect,
    handleCategoryToggle,
    handleAddMaterial,
    handleUploadPDF,
  };
};

