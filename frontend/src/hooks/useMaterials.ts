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
  data: {
    data: BackendMaterial[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
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

export const useMaterials = (categoriaFiltro?: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [fabricMaterials, setFabricMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const mapBackendToFrontend = (backendMaterial: BackendMaterial): Material => {
    const categoryMap: Record<string, Material['category']> = {
      'Tela': 'tela',
      'Botones': 'botones',
      'Hilos': 'hilos',
      'Hilo': 'hilos',
    };

    const category = categoryMap[backendMaterial.categoria] || 'otros';

    return {
      id: backendMaterial.id.toString(),
      name: backendMaterial.nombre,
      category,
      quantity: backendMaterial.peso,
      unit: backendMaterial.unidadMedida,
      colors: backendMaterial.colores,
      measure: `${backendMaterial.ancho}cm`,
      price: `$${backendMaterial.precio.toFixed(2)}`,
      imageUrl: backendMaterial.url_imagen,
    };
  };

  useEffect(() => {
    if (!categoriaFiltro) {
      setIsLoading(false);
      return;
    }
    const fetchFabricMaterials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/materiales`;
        if (categoriaFiltro) {
          url += `?categoria=${encodeURIComponent(categoriaFiltro)}`;
        }
        console.log('========== DEBUG START ==========');
        console.log('1. URL completa:', url);
        console.log('2. Categoria filtro:', categoriaFiltro);

        const response = await fetch(url);
        console.log('3. Response status:', response.status);

        if (!response.ok) {
          throw new Error('Error al cargar los materiales de tela');
        }

        const result: BackendResponse = await response.json();
        console.log('4. Result completo:', result);
        console.log('5. result.data:', result.data);
        console.log('6. result.data.data:', result.data.data);
        console.log('7. Cantidad de items:', result.data.data.length);

        if (result.data.data.length > 0) {
          console.log('8. Primer item del backend:', result.data.data[0]);
          console.log('9. Categoría del primer item:', result.data.data[0].categoria);
        }

        if (result.data && Array.isArray(result.data.data)) {
          console.log('Data array length:', result.data.data.length);
          const mappedMaterials = result.data.data.map(mapBackendToFrontend);
          console.log('10. Mapped materials:', mappedMaterials);
          console.log('11. Cantidad de mapped materials:', mappedMaterials.length);
          setFabricMaterials(mappedMaterials);
        } else {
          console.error('Estructura de datos inválida:', result);
          throw new Error('Formato de respuesta inválido');
        }
        console.log('========== DEBUG END ==========');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching fabric materials:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFabricMaterials();
  }, [categoriaFiltro]);

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

    let filtered = fabricMaterials;
    if (categoriaFiltro) {
      const categoryLower = categoriaFiltro.toLowerCase();
      filtered = filtered.filter(m => m.category === categoryLower);
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

