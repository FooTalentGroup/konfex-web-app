"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useProductos, type Producto } from "@/hooks/useProductos";

interface GarmentAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (producto: Producto) => void;
  placeholder?: string;
  className?: string;
}

export default function GarmentAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Ej.: Blusa manga larga - azul",
  className = "",
}: GarmentAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { searchProductos, loading } = useProductos();
  const resultados = value.trim() ? searchProductos(value) : [];

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (producto: Producto) => {
    onChange(producto.nombre);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    // Si hay callback para manejar la selección, lo llamamos
    if (onSelect) {
      onSelect(producto);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || resultados.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < resultados.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < resultados.length) {
          handleSelect(resultados[highlightedIndex]);
        } else if (resultados.length === 1) {
          handleSelect(resultados[0]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (value.trim() && resultados.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-[#F3F0F5] rounded-xl p-3.5 pr-10 text-sm outline-none text-gray-800 placeholder:text-gray-400 border border-black transition-colors"
      />
      <ChevronDown
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
        size={18}
      />

      {loading && value.trim() && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 p-3">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Buscando...</span>
          </div>
        </div>
      )}

      {isOpen && !loading && value.trim() && resultados.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {resultados.map((producto, index) => (
            <div
              key={producto.id}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? "bg-[#F4E7FD]"
                  : "hover:bg-[#F3F0F5]"
              } ${index === 0 ? "rounded-t-xl" : ""} ${
                index === resultados.length - 1 ? "rounded-b-xl" : ""
              }`}
              onClick={() => handleSelect(producto)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="font-medium text-gray-800 text-sm">
                {producto.nombre}
              </div>
              {producto.descripcion && (
                <div className="text-xs text-gray-500 mt-1">
                  {producto.descripcion}
                </div>
              )}
              {(producto.tallas.length > 0 || producto.colores.length > 0) && (
                <div className="flex gap-2 mt-1 flex-wrap">
                  {producto.tallas.length > 0 && (
                    <span className="text-xs text-gray-600">
                      Tallas: {producto.tallas.join(", ")}
                    </span>
                  )}
                  {producto.colores.length > 0 && (
                    <span className="text-xs text-gray-600">
                      Colores: {producto.colores.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen &&
        !loading &&
        value.trim() &&
        resultados.length === 0 &&
        value.length > 2 && (
          <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 p-4">
            <div className="text-sm text-gray-500 text-center">
              No se encontraron prendas con ese nombre
            </div>
          </div>
        )}
    </div>
  );
}

