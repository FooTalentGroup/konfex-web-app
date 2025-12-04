import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Minus, ChevronDown } from "lucide-react";
import CircularAddButton from "@/components/common/CircularAddButton";
import GarmentAutocomplete from "../GarmentAutocomplete";
import BudgetTotalBadge from "../BudgetTotalBadge";
import type { Producto } from "@/hooks/useProductos";

interface MaterialVariant {
  size: string;
  quantity: number;
}

interface Material {
  name: string;
  unitPrice: number;
  variants: MaterialVariant[];
}

export default function BudgetMaterials() {
  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const [tempName, setTempName] = useState("");
  const [tempPrice, setTempPrice] = useState("35000");
  const [tempVariants, setTempVariants] = useState<
    { size: string; quantity: number }[]
  >([]);

  const [currentSize, setCurrentSize] = useState("M");
  const [currentQty, setCurrentQty] = useState(1);

  const addVariant = () => {
    if (currentQty > 0) {
      // Check if size already exists
      const existingIndex = tempVariants.findIndex(
        (v) => v.size === currentSize
      );
      if (existingIndex >= 0) {
        // Update existing variant
        const updated = [...tempVariants];
        updated[existingIndex].quantity = currentQty;
        setTempVariants(updated);
      } else {
        // Add new variant
        setTempVariants([
          ...tempVariants,
          { size: currentSize, quantity: currentQty },
        ]);
      }
      setCurrentQty(1);
    }
  };

  const removeVariant = (index: number) => {
    setTempVariants(tempVariants.filter((_, i) => i !== index));
  };

  const handleAddMaterial = () => {
    const finalName = tempName.trim() || "Prenda nueva";
    const finalVariants = [...tempVariants];

    if (finalVariants.length === 0 && currentQty > 0) {
      finalVariants.push({ size: currentSize, quantity: currentQty });
    }

    if (!tempPrice || finalVariants.length === 0) return;

    append({
      name: finalName,
      unitPrice: parseFloat(tempPrice) || 0,
      variants: finalVariants,
    });

    setTempName("");
    setTempPrice("35000");
    setTempVariants([]);
    setCurrentQty(12);
    setCurrentSize("M");
  };

  const materials = (watch("materials") as Material[]) || [];
  const totalMaterials = materials.reduce((sum: number, item: Material) => {
    const totalQty =
      item.variants?.reduce(
        (acc: number, v: MaterialVariant) => acc + v.quantity,
        0
      ) || 0;
    return sum + totalQty * item.unitPrice;
  }, 0);

  return (
    <div className="p-5 pb-10 font-lato">
      {/* Total detalle header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="font-bold text-gray-900 text-base">Total detalle</span>
        <BudgetTotalBadge amount={totalMaterials} />
      </div>

      {/* Instruction text */}
      <p className="text-sm text-gray-600 mb-6 px-1">
        Agrega las prendas y tallas del pedido.
      </p>

      {/* Form container */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-6">
        {/* Nombre prenda */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Nombre prenda
          </label>
          <GarmentAutocomplete
            value={tempName}
            onChange={setTempName}
            onSelect={(producto: Producto) => {
              // Si el producto tiene tallas disponibles, podemos pre-seleccionar la primera
              if (producto.tallas && producto.tallas.length > 0) {
                setCurrentSize(producto.tallas[0]);
              }
              // Aquí podrías cargar el precio desde colecciones si está disponible
            }}
            placeholder="Ej.: Blusa manga larga - azul"
          />
        </div>

        {/* Precio unitario section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-bold text-gray-700">
              Precio unitario:
            </label>
            <span className="font-bold text-gray-800 text-sm">
              ${" "}
              {parseFloat(tempPrice || "0").toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <p className="text-xs text-gray-500 ml-1">
            Precio unitario de la prenda viene del precio de colecciones
          </p>
          <input
            type="number"
            value={tempPrice}
            onChange={(e) => setTempPrice(e.target.value)}
            className="hidden"
          />
        </div>

        {/* Talla and Cantidad inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
              Talla
            </label>
            <div className="relative">
              <select
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
                className="w-full bg-[#F3F0F5] rounded-xl p-3 text-sm appearance-none outline-none text-gray-700 font-medium cursor-pointer border border-black"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
              Cantidad
            </label>
            <div className="flex items-center bg-[#F3F0F5] rounded-xl p-1 justify-between border border-black">
              <button
                type="button"
                onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={currentQty}
                onChange={(e) => setCurrentQty(parseInt(e.target.value) || 0)}
                className="w-12 bg-transparent text-center text-sm outline-none font-bold text-gray-800"
              />
              <button
                type="button"
                onClick={() => setCurrentQty(currentQty + 1)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Agregar talla button */}
        <div className="mb-5">
          <CircularAddButton
            onClick={addVariant}
            label="Agregar talla"
            variant="centered"
            iconSize={28}
          />
        </div>

        {/* Lista de tallas agregadas */}
        {tempVariants.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-700 mb-2 ml-1">
              Lista de tallas agregadas:
            </p>
            <div className="space-y-2">
              {tempVariants.map((v, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#F3F0F5] p-3 rounded-xl text-sm border border-black"
                >
                  <span className="font-medium text-gray-700">
                    Talla: {v.size}
                  </span>
                  <div className="flex gap-4 items-center ">
                    <span className="font-medium  text-gray-700">
                      Cantidad: {v.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="bg-[#F3F0F5] hover:bg-gray-200 rounded p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agregar prenda button */}
        <div className="pt-2 pb-2">
          <CircularAddButton
            onClick={handleAddMaterial}
            label="Agregar prenda"
            variant="centered"
            iconSize={28}
          />
        </div>
      </div>

      {/* Lista de prendas agregadas */}
      <div className="space-y-3">
        {fields.length > 0 && (
          <p className="text-xs font-bold text-gray-700 mb-2 ml-1">
            Lista de prendas agregadas:
          </p>
        )}
        {fields.map((field, index) => {
          const material = field as unknown as Material;
          return (
            <div
              key={field.id}
              className="bg-[#F3F0F5] p-4 rounded-xl flex justify-between items-center text-sm border border-black"
            >
              <span className="font-bold text-gray-800 text-base shrink-0">
                {material.name}
              </span>
              <div className="text-gray-600 text-sm flex flex-col gap-1">
                {material.variants?.map((v: MaterialVariant, i: number) => (
                  <span key={i}>{v.size}</span>
                ))}
              </div>

              <div className="text-gray-600 text-sm flex flex-col gap-1">
                {material.variants?.map((v: MaterialVariant, i: number) => (
                  <span key={i}>{v.quantity} uds.</span>
                ))}
              </div>

              <button
                onClick={() => remove(index)}
                className="bg-[#F3F0F5] hover:bg-gray-200 rounded p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
        {fields.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-4 italic font-light">
            No hay prendas agregadas
          </div>
        )}
      </div>

      <div className="h-8"></div>
    </div>
  );
}
