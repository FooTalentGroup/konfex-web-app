import { useState, useMemo, useEffect } from 'react';

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

interface BackendMaterial {
  id: number;
  nombre: string;
  url_imagen: string;
  categoria: string;
  unidadMedida: string;
  ancho: number;
  peso: number;
  colores: string[];
  proveedor: string;
  precio: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BackendMaterial[];
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

export const useMaterials = (categoriaId?: number) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [fabricMaterials, setFabricMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapBackendToFrontend = (backendMaterial: BackendMaterial): Material => {
    return {
      id: backendMaterial.id.toString(),
      name: backendMaterial.nombre,
      category: 'otros',
      quantity: backendMaterial.peso || 0,
      unit: backendMaterial.unidadMedida,
      colors: backendMaterial.colores,
      measure: backendMaterial.ancho ? `${backendMaterial.ancho}cm` : undefined,
      price: `$${backendMaterial.precio.toFixed(2)}`,
      imageUrl: backendMaterial.url_imagen || undefined,
    };
  };

  useEffect(() => {
    if (!categoriaId) {
      setIsLoading(false);
      return;
    }

    const fetchFabricMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Usar el nuevo endpoint con el ID de categoría
        const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/${categoriaId}/materiales`;

        console.log('========== DEBUG START ==========');
        console.log('1. URL completa:', url);
        console.log('2. Categoria ID:', categoriaId);

        const response = await fetch(url);
        console.log('3. Response status:', response.status);

        if (!response.ok) {
          throw new Error('Error al cargar los materiales');
        }

        const result: BackendResponse = await response.json();
        console.log('4. Result completo:', result);

        if (result.data && Array.isArray(result.data)) {
          console.log('5. Cantidad de items:', result.data.length);

          if (result.data.length > 0) {
            console.log('6. Primer item:', result.data[0]);
          }

          const mappedMaterials = result.data.map(mapBackendToFrontend);
          console.log('7. Mapped materials:', mappedMaterials);
          setFabricMaterials(mappedMaterials);
        } else {
          console.error('Estructura de datos inválida:', result);
          throw new Error('Formato de respuesta inválido');
        }
        console.log('========== DEBUG END ==========');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching fabric materials:', err);
        setFabricMaterials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFabricMaterials();
  }, [categoriaId]);

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

  const [fabricSearchQuery, setFabricSearchQuery] = useState('');

  const filteredFabricMaterials = useMemo(() => {
    if (!Array.isArray(fabricMaterials)) {
      return [];
    }

    if (!fabricSearchQuery.trim()) {
      return fabricMaterials;
    }

    const searchTerm = fabricSearchQuery.toLowerCase();
    return fabricMaterials.filter(
      (material) =>
        material.name.toLowerCase().includes(searchTerm) ||
        material.colors?.some((color) => color.toLowerCase().includes(searchTerm)) ||
        material.price?.toLowerCase().includes(searchTerm)
    );
  }, [fabricSearchQuery, fabricMaterials]);

  const handleFabricSearch = (value: string) => {
    setFabricSearchQuery(value);
  };

  const handleMaterialClick = (materialId: string) => {
    console.log('Material clicked:', materialId);
  };

  return {
    materials: filteredMaterials,
    fabricMaterials,
    filteredFabricMaterials,
    searchQuery,
    fabricSearchQuery,
    selectedCategory,
    isLoading,
    error,
    handleSearch,
    handleFabricSearch,
    handleCategorySelect,
    handleCategoryToggle,
    handleAddMaterial,
    handleMaterialClick,
  };
};