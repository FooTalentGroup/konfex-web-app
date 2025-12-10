import { useState } from "react";
import Image from "next/image";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import CircularAddButton from "@/components/common/CircularAddButton";
import GarmentAutocomplete from "../GarmentAutocomplete";
import BudgetTotalBadge from "../BudgetTotalBadge";
import type { Producto } from "@/hooks/useProductos";

interface MaterialVariant {
  size: string;
  quantity: number;
}

interface Material {
  productoId?: number;
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
  const [tempProductoId, setTempProductoId] = useState<number | undefined>(
    undefined
  );
  const [tempPrice, setTempPrice] = useState("0");
  const [tempVariants, setTempVariants] = useState<
    { size: string; quantity: number }[]
  >([]);

  const [currentSize, setCurrentSize] = useState("Elige una talla");
  const [currentQty, setCurrentQty] = useState(1);
  const [sizeOpen, setSizeOpen] = useState(false);
  const availableSizes = ["S", "M", "L", "XL"];

  const addVariant = () => {
    if (currentQty >= 1) {
      const existingIndex = tempVariants.findIndex(
        (v) => v.size === currentSize
      );
      if (existingIndex >= 0) {
        const updated = [...tempVariants];
        updated[existingIndex].quantity = currentQty;
        setTempVariants(updated);
      } else {
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

    if (finalVariants.length === 0 && currentQty >= 1) {
      finalVariants.push({ size: currentSize, quantity: currentQty });
    }

    if (!tempPrice || finalVariants.length === 0) return;

    if (!tempProductoId && tempName.trim()) {
      console.warn(
        "⚠️ Material agregado sin productoId. Se recomienda seleccionar desde el autocomplete."
      );
    }

    append({
      productoId: tempProductoId,
      name: finalName,
      unitPrice: parseFloat(tempPrice) || 0,
      variants: finalVariants,
    });

    setTempName("");
    setTempProductoId(undefined);
    setTempPrice("0");
    setTempVariants([]);
    setCurrentQty(1);
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
    <div className="p-5 pb-12 font-lato bg-[#F4E7FD] rounded-b-[22px] space-y-5 overflow-x-hidden">
      <div className="flex justify-between items-center mb-2 px-1 -mt-3 pl-2 sm:pl-3">
        <span className="font-bold text-[16px] leading-[1.31] text-black">
          Total detalle:
        </span>
        <BudgetTotalBadge amount={totalMaterials} className="text-[#C071F4]!" />
      </div>
      <div className="h-px bg-[#CEC2D6] mb-3 -mt-2 mx-[6px] sm:mx-[10px]"></div>

      <p className="text-[13px] text-[#8B709D] px-1 leading-normal pl-2 sm:pl-3">
        Agrega las prendas y tallas del pedido.
      </p>

      <div className="bg-[#F3F0F5] px-[8px] pt-[8px] pb-[30px] rounded-[10px] border-[0.5px] border-[#CEC2D6] relative space-y-[20px] w-full max-w-[390px] sm:max-w-[520px] lg:max-w-[640px] mx-auto -mt-2">
        <div className="space-y-2">
          <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] ml-1">
            Nombre prenda
          </label>
          <GarmentAutocomplete
            value={tempName}
            onChange={(value) => {
              if (value.length <= 100) {
                setTempName(value);

                if (value.trim() === "") {
                  setTempPrice("0");
                  setTempProductoId(undefined);
                }
              }
            }}
            onSelect={(producto: Producto) => {
              const nombre = producto.nombre.substring(0, 100);
              setTempName(nombre);
              setTempProductoId(producto.id);

              if (producto.precio !== undefined && producto.precio !== null) {
                setTempPrice(producto.precio.toString());
              }

              if (producto.tallas && producto.tallas.length > 0) {
                setCurrentSize(producto.tallas[0]);
              }
            }}
            placeholder="Ej.: Blusa manga larga - azul"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-[14px] font-bold leading-[1.31] text-[#4F3E5B]">
              Precio unitario:
            </label>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[13px] text-[#6A5379]">
                {parseFloat(tempPrice || "0").toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <Image
                src="/totalCal.png"
                alt="Total"
                width={18}
                height={18}
                className="shrink-0 -translate-y-px"
              />
            </div>
          </div>
          <p className="text-[12px] text-[#6A5379] ml-1 leading-[1.4]">
            Precio unitario de la prenda viene del precio de colecciones
          </p>
          <input
            type="number"
            value={tempPrice}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val >= 0 && val <= 999999999) {
                setTempPrice(e.target.value);
              } else if (e.target.value === "") {
                setTempPrice("0");
              }
            }}
            min="0"
            max="999999999"
            className="hidden"
          />
        </div>

        <div className="bg-[#F3F0F5] border-[0.5px] border-[#CEC2D6] rounded-[10px] px-[10px] pt-[10px] pb-[20px] flex flex-col gap-4 w-full max-w-[374px] sm:max-w-[440px] lg:max-w-[520px] mx-auto">
          <div className="flex justify-between gap-[6px] w-full">
            <div className="w-[135px] sm:w-[180px] lg:w-[200px]">
              <label className="block text-[12px] font-bold text-[#1A151E] mb-1.5 ml-1">
                Talla
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSizeOpen((v) => !v)}
                  className="w-full bg-white rounded-lg h-10 px-3 text-sm text-[#B5A4C1] appearance-none outline-none font-normal cursor-pointer border border-[#DCCBEB] flex items-center justify-between"
                >
                  <span>{currentSize}</span>
                  <ChevronDown
                    className={`text-[#B5A4C1] transition-transform ${
                      sizeOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                {sizeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-[#DCCBEB] rounded-lg overflow-hidden">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setCurrentSize(size);
                          setSizeOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          size === currentSize
                            ? "bg-[#F4E7FD] text-[#1A151E] font-semibold"
                            : "hover:bg-[#F9F6FF] text-[#1A151E]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-[140px] sm:w-[150px] ml-auto">
              <label className="block text-[12px] font-bold text-[#1A151E] mb-1.5 ml-1">
                Cantidad
              </label>
              <div className="flex items-center bg-white rounded-lg h-10 px-3 justify-between border border-[#DCCBEB]">
                <button
                  type="button"
                  onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}
                  disabled={currentQty <= 1}
                  className={`px-2.5 rounded-md bg-transparent transition-colors text-2xl font-normal leading-none text-[#1A151E] hover:text-[#6A5379] ${
                    currentQty <= 1 ? "cursor-not-allowed" : ""
                  }`}
                >
                  <span className="inline-block scale-x-125">-</span>
                </button>
                <input
                  type="number"
                  value={currentQty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) {
                      setCurrentQty(1);
                    } else {
                      setCurrentQty(val);
                    }
                  }}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) {
                      setCurrentQty(1);
                    }
                  }}
                  className="w-16 bg-transparent text-center text-sm outline-none font-normal text-[#B5A4C1] appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="1"
                  step="1"
                />
                <button
                  type="button"
                  onClick={() => setCurrentQty(currentQty + 1)}
                  className="px-2.5 rounded-md bg-transparent transition-colors text-2xl font-normal leading-none text-[#1A151E] hover:text-[#6A5379]"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <CircularAddButton
            onClick={addVariant}
            label="Agregar talla"
            variant="centered"
            iconSize={32}
            hideLines
            className="-mt-8"
            labelClassName="text-[#6A5379] text-[13px] font-normal mt-2 text-center"
          />
        </div>

        {tempVariants.length > 0 && (
          <div className="mb-5">
            <p className="text-[14px] font-bold text-[#4F3E5B] mb-2 ml-1">
              Lista de tallas agregadas:
            </p>
            <div className="space-y-2">
              {tempVariants.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#EDE9F1] h-[44px] w-full max-w-[374px] sm:max-w-[480px] rounded-[10px] text-sm border border-[#DCCBEB] px-[10px] gap-3 sm:gap-[27px] mx-auto"
                >
                  <span className="font-medium text-[#1A151E]">
                    Talla: {v.size}
                  </span>
                  <div className="flex gap-4 items-center ">
                    <span className="font-medium text-[#1A151E]">
                      Cantidad: {v.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="bg-transparent rounded p-1.5 ml-4 sm:ml-6"
                    >
                      <Image
                        src="/trash.png"
                        alt="Eliminar"
                        width={28}
                        height={28}
                        className="pointer-events-none"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 mb-5">
        <CircularAddButton
          onClick={handleAddMaterial}
          label="Agregar prenda"
          variant="centered"
          iconSize={32}
          hideLines
          className="-mt-9 z-10"
          labelClassName="text-[#6A5379] text-[13px] font-normal mt-2 text-center"
        />
      </div>

      <div className="space-y-3">
        {fields.length > 0 && (
          <p className="text-[14px] font-bold leading-[1.31] text-[#4F3E5B] mb-2 ml-1">
            Lista de prendas agregadas:
          </p>
        )}
        {fields.map((field, index) => {
          const material = field as unknown as Material;
          return (
            <div
              key={field.id}
              className="bg-[#EDE9F1] min-h-[44px] w-full max-w-full sm:max-w-[600px] mx-auto rounded-[10px] flex flex-nowrap sm:flex-wrap items-center border border-[#CEC2D6] px-[10px] gap-3 sm:gap-[27px] text-sm text-[#000000]"
            >
              <span className="font-normal text-base text-[#000000] leading-[1.31] truncate">
                {material.name}
              </span>
              <div className="text-sm flex flex-col gap-1 text-[#000000] font-normal ml-auto text-right pr-3 sm:min-w-[70px]">
                {material.variants?.map((v: MaterialVariant, i: number) => (
                  <span key={i}>{v.size}</span>
                ))}
              </div>

              <div className="text-sm flex flex-col gap-1 text-[#000000] font-normal ml-auto text-right pr-2 sm:min-w-[80px]">
                {material.variants?.map((v: MaterialVariant, i: number) => (
                  <span key={i}>{v.quantity} uds.</span>
                ))}
              </div>

              <button
                onClick={() => remove(index)}
                className="bg-transparent rounded p-1.5 shrink-0 ml-1"
              >
                <Image
                  src="/trash.png"
                  alt="Eliminar"
                  width={28}
                  height={28}
                  className="pointer-events-none"
                />
              </button>
            </div>
          );
        })}
        {fields.length === 0 && (
          <div className="text-center text-[#B5A4C1] text-sm py-4 italic font-light">
            No hay prendas agregadas
          </div>
        )}
      </div>

      <div className="h-8"></div>
    </div>
  );
}
