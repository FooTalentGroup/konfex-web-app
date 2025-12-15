'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Material } from '@/types/IFabric';

interface MaterialSearchSelectProps {
    id: string;
    label: string;
    materials: Material[];
    isLoading?: boolean;
    error?: string;
    value?: string; 
    onChange: (materialId: string, material: Material) => void;
    placeholder?: string;
    type?: 'fabric' | 'supply'; 
}

const MaterialSearchSelect: React.FC<MaterialSearchSelectProps> = ({
    id,
    label,
    materials,
    isLoading = false,
    error,
    value,
    onChange,
    placeholder = 'Buscar material...',
    type,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredByType = type
        ? materials.filter(m => {
            if (type === 'fabric') {
                return m.categoria?.nombre?.toLowerCase() === 'tela';
            } else {
                return m.categoria?.nombre?.toLowerCase() !== 'tela';
            }
        })
        : materials;

    const filteredMaterials = filteredByType.filter(material => {
        const query = searchQuery.toLowerCase();
        
        return (
            material.nombre?.toLowerCase().includes(query) ||
            material.proveedor?.toLowerCase().includes(query) ||
            material.colores?.some(color => color.toLowerCase().includes(query))
        );
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            const material = materials.find(m => m.id.toString() === value);
            setSelectedMaterial(material || null);
        } else {
            setSelectedMaterial(null);
        }
    }, [value, materials]);

    const handleSelectMaterial = (material: Material) => {
        setSelectedMaterial(material);
        onChange(material.id.toString(), material);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div className="flex flex-col space-y-1" ref={dropdownRef}>
            <label htmlFor={id} className="text-sm font-medium text-black">
                {label}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={handleToggleDropdown}
                    className={`w-full p-3 pr-10 text-left border rounded-lg transition duration-150 ease-in-out ${
                        error 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-[#6A5379] focus:ring-purple-300 focus:border-purple-300'
                    } bg-white focus:outline-none focus:ring-1`}
                >
                    {selectedMaterial ? (
                        <span className="text-black">{selectedMaterial.nombre}</span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </button>

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                    {/* Input de búsqueda dentro del dropdown */}
                    <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por nombre, proveedor o color..."
                                className="w-full pl-10 pr-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-80">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <span className="text-sm">Cargando materiales...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-8 text-red-500">
                                <AlertCircle className="w-6 h-6 mb-2" />
                                <span className="text-sm">{error}</span>
                            </div>
                        ) : filteredMaterials.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <AlertCircle className="w-6 h-6 mb-2" />
                                <span className="text-sm">
                                    {searchQuery 
                                        ? 'No se encontraron materiales' 
                                        : 'No hay materiales disponibles'}
                                </span>
                            </div>
                        ) : (

                            filteredMaterials.map((material) => (
                                <button
                                    key={material.id}
                                    type="button"
                                    onClick={() => handleSelectMaterial(material)}
                                    className="w-full p-4 hover:bg-purple-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="font-semibold text-gray-900">
                                            {material.nombre}
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                            {/* Precio */}
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                <span className="font-medium text-green-600">
                                                    ${material.precio?.toLocaleString('es-CO')}
                                                </span>
                                            </span>

                                            {material.proveedor && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 3.348 3h17.304a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                                    </svg>
                                                    {material.proveedor}
                                                </span>
                                            )}

                                            {material.colores && material.colores.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                                                    </svg>
                                                    {material.colores.slice(0, 2).join(', ')}
                                                    {material.colores.length > 2 && ` +${material.colores.length - 2}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default MaterialSearchSelect;