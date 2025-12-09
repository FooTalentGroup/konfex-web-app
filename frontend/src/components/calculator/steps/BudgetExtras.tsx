import React, { useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";
import CircularAddButton from "@/components/common/CircularAddButton";
import BudgetTotalBadge from "../BudgetTotalBadge";
import { presupuestoService } from "@/services/presupuesto.service";
import { clienteService } from "@/services/cliente.service";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";
import { mapFormDataToBackend } from "@/utils/presupuestoMapper";
import { useToast } from "@/contexts/ToastContext";

interface Extra {
  name: string;
  quantity: number;
  amount: number;
}

interface Material {
  productoId?: number;
  name: string;
  unitPrice: number;
  variants: Array<{ size: string; quantity: number }>;
}

interface BudgetExtrasProps {
  presupuestoId?: number;
  isEditMode?: boolean;
  origen?: "telegram" | "manual";
}

export default function BudgetExtras({
  presupuestoId,
  isEditMode = false,
  origen = "manual",
}: BudgetExtrasProps) {
  const {
    control,
    watch,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const { gastosNegocio } = useGastosNegocio();
  const { showSuccess, showError, showInfo } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras",
  });

  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState("");

  // Obtener shippingFee del formulario en lugar de estado local
  const shippingFee = useWatch({ control, name: "shippingFee" }) || "";
  const setShippingFee = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue("shippingFee", numValue, { shouldValidate: true });
  };

  const handleAddExtra = () => {
    if (!name.trim()) return;
    const finalAmount = Math.max(0, parseFloat(amount) || 0);
    append({ name: name, quantity: qty, amount: finalAmount });
    setName("");
    setQty(1);
    setAmount("");
  };

  const extras = watch("extras") || [];
  const materials = useWatch({ control, name: "materials" }) || [];
  const gastosNegocioId = useWatch({ control, name: "gastosNegocioId" });
  const shippingFeeValue =
    typeof shippingFee === "number"
      ? shippingFee
      : Math.max(0, parseFloat(String(shippingFee || "0")) || 0);
  const totalExtras = extras.reduce(
    (sum: number, item: { quantity: number; amount: number }) => {
      const itemAmount = Math.max(0, item.amount || 0);
      return sum + item.quantity * itemAmount;
    },
    0
  );
  const total = totalExtras + shippingFeeValue;

  const handleRevisar = async () => {
    try {
      setIsSaving(true);
      const currentBudgetData = getValues();

      // Validaciones básicas
      if (!currentBudgetData.title?.trim()) {
        showError("Por favor ingresa un título para el presupuesto");
        return;
      }

      if (!currentBudgetData.clientName?.trim()) {
        showError("Por favor ingresa el nombre del cliente");
        return;
      }

      // Obtener automáticamente el primer gasto de negocio si no hay uno seleccionado
      let finalGastosNegocioId = gastosNegocioId;
      if (!finalGastosNegocioId && gastosNegocio.length > 0) {
        finalGastosNegocioId = gastosNegocio[0].id;
        setValue("gastosNegocioId", finalGastosNegocioId, {
          shouldValidate: false,
        });
      }

      if (!finalGastosNegocioId) {
        showError(
          "No se encontraron gastos de negocio configurados. Por favor contacta al administrador."
        );
        return;
      }

      if (materials.length === 0) {
        showError("Por favor agrega al menos un material/prenda");
        return;
      }

      // Validar que todos los materiales tengan productoId
      const materialesSinProductoId = materials.filter(
        (m: Material) => !m.productoId
      );
      if (materialesSinProductoId.length > 0) {
        const nombres = materialesSinProductoId
          .map((m: Material) => m.name)
          .join(", ");
        showError(
          `Los siguientes materiales no tienen producto asociado. Por favor selecciónalos desde el autocomplete: ${nombres}`,
          5000
        );
        return;
      }

      // Obtener o crear cliente
      let clienteId = currentBudgetData.clienteId;
      if (!clienteId) {
        try {
          showInfo("Buscando cliente...");
          const cliente = await clienteService.findOrCreate(
            currentBudgetData.clientName,
            {
              email: currentBudgetData.clientEmail,
              telefono: currentBudgetData.clientPhone,
            }
          );
          clienteId = cliente.id;
        } catch (error) {
          console.error("Error al obtener/crear cliente:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al procesar el cliente. Por favor intenta nuevamente.";
          showError(errorMessage);
          return;
        }
      }

      // Validar que haya gastos de negocio disponibles
      if (!gastosNegocio || gastosNegocio.length === 0) {
        showError(
          "No se encontraron gastos de negocio configurados. Por favor contacta al administrador."
        );
        return;
      }

      // Mapear datos del formulario al formato del backend
      const payload = mapFormDataToBackend(
        {
          ...currentBudgetData,
          clienteId,
          gastosNegocioId: finalGastosNegocioId,
          materials: (currentBudgetData.materials || []) as Material[],
          extras: (currentBudgetData.extras || []) as Extra[],
        } as Parameters<typeof mapFormDataToBackend>[0],
        gastosNegocio,
        origen
      );

      // Crear o actualizar presupuesto en el backend
      if (isEditMode && presupuestoId) {
        showInfo("Actualizando presupuesto...");
        const updatedPresupuesto = await presupuestoService.update(
          presupuestoId,
          payload
        );

        console.log(
          "✅ Presupuesto actualizado exitosamente:",
          updatedPresupuesto
        );

        showSuccess(
          `Presupuesto #${updatedPresupuesto.numeroPresupuesto} actualizado exitosamente`,
          4000
        );

        // Redirigir a presupuestos después de un breve delay
        setTimeout(() => {
          router.push("/presupuestos");
        }, 1500);
      } else {
        showInfo("Creando presupuesto...");
        const createdPresupuesto = await presupuestoService.create(payload);

        console.log("✅ Presupuesto creado exitosamente:", createdPresupuesto);

        showSuccess(
          `Presupuesto #${createdPresupuesto.numeroPresupuesto} creado exitosamente`,
          4000
        );

        // Redirigir a presupuestos después de un breve delay para que se vea el toast
        setTimeout(() => {
          router.push("/presupuestos");
        }, 1500);
      }
    } catch (error) {
      console.error("Error al crear presupuesto:", error);

      // Mejorar mensajes de error específicos
      let errorMessage = "Error desconocido al crear presupuesto";

      if (error instanceof Error) {
        const message = error.message;

        // Mensajes específicos según el tipo de error
        if (message.includes("productoId")) {
          errorMessage =
            "Uno o más materiales no tienen producto asociado. Por favor selecciónalos desde el autocomplete.";
        } else if (message.includes("cliente")) {
          errorMessage =
            "Error al procesar el cliente. Verifica que el nombre sea válido.";
        } else if (message.includes("gastosNegocioId")) {
          errorMessage =
            "Error con los gastos de negocio. Por favor selecciona uno válido.";
        } else if (
          message.includes("API 400") ||
          message.includes("validación")
        ) {
          errorMessage =
            "Los datos ingresados no son válidos. Por favor revisa el formulario.";
        } else if (message.includes("API 404")) {
          errorMessage =
            "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
        } else if (message.includes("API 500")) {
          errorMessage =
            "Error interno del servidor. Por favor intenta nuevamente más tarde.";
        } else {
          errorMessage = message;
        }
      }

      showError(errorMessage, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 pb-10 font-lato">
      {/* Encabezado */}
      <div className="mb-4 px-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-900 text-base">
            Costos adicionales:
          </span>
          <BudgetTotalBadge amount={total} />
        </div>
        <p className="text-sm text-gray-600 ml-1">
          Suma los extras que necesitas.
        </p>
      </div>

      {/* Tarifa de envío */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          Tarifa de envío
        </label>
        <div className="relative group">
          <input
            type="number"
            value={
              typeof shippingFee === "number" ? shippingFee : shippingFee || ""
            }
            onChange={(e) => {
              const inputValue = e.target.value;
              // Permitir campo vacío o solo el signo menos para poder borrar
              if (inputValue === "" || inputValue === "-") {
                // No permitir que se escriba el signo menos solo
                if (inputValue === "-") {
                  return;
                }
                setShippingFee("0");
              } else {
                const val = parseFloat(inputValue);
                // Solo permitir valores válidos >= 0
                if (!isNaN(val) && val >= 0) {
                  setShippingFee(inputValue);
                }
                // Si es negativo o inválido, no actualizar
              }
            }}
            onBlur={(e) => {
              const val = parseFloat(e.target.value);
              if (isNaN(val) || val < 0) {
                setShippingFee("0");
              }
            }}
            placeholder="000.000"
            className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 text-right shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
            min="0"
            step="0.01"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#8B709D] transition-colors">
            $
          </span>
        </div>
      </div>

      {/* Formulario de Costo adicional */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Costo adicional
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              // Limitar a 100 caracteres
              if (e.target.value.length <= 100) {
                setName(e.target.value);
              }
            }}
            placeholder="Ej.: Estampado, botones adicionales"
            maxLength={100}
            className="w-full bg-[#F3F0F5] rounded-xl p-3.5 text-sm outline-none text-gray-800 placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
              Cantidad
            </label>
            <div className="flex items-center bg-[#F3F0F5] rounded-xl p-1 justify-between">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className={`p-2 rounded-lg transition-all ${
                  qty <= 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white"
                }`}
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) {
                    setQty(1);
                  } else if (val > 9999) {
                    setQty(9999);
                  } else {
                    setQty(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) {
                    setQty(1);
                  } else if (val > 9999) {
                    setQty(9999);
                  }
                }}
                placeholder="00"
                className="w-12 bg-transparent text-center text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400"
                min="1"
                max="9999"
                step="1"
              />
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
              Monto
            </label>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Permitir campo vacío para poder borrar
                  if (inputValue === "" || inputValue === "-") {
                    // No permitir que se escriba el signo menos solo
                    if (inputValue === "-") {
                      return;
                    }
                    setAmount("");
                  } else {
                    const val = parseFloat(inputValue);
                    // Solo permitir valores válidos >= 0
                    if (!isNaN(val) && val >= 0) {
                      setAmount(inputValue);
                    }
                    // Si es negativo o inválido, no actualizar
                  }
                }}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setAmount("");
                  }
                }}
                placeholder="000.000"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 text-right shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
                min="0"
                step="0.01"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#8B709D] transition-colors">
                $
              </span>
            </div>
          </div>
        </div>

        <CircularAddButton
          onClick={handleAddExtra}
          variant="centered"
          label="Agregar extra"
        />
      </div>

      {/* Lista de prendas agregadas */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
          Lista de prendas agregadas:
        </label>
        <div className="space-y-3">
          {fields.map((field, index) => {
            const extra = field as unknown as Extra;
            return (
              <div
                key={field.id}
                className="bg-[#F3F0F5] p-4 rounded-xl flex justify-between items-center text-sm border border-transparent hover:border-gray-200 transition-colors"
              >
                <span className="font-bold text-gray-800 text-base">
                  {extra.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-medium text-sm">
                    {extra.quantity} uds.
                  </span>
                  <button
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {fields.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-2 italic font-light">
              Sin costos adicionales
            </div>
          )}
        </div>
      </div>

      {/* Observaciones */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
          Observaciones
        </label>
        <textarea
          {...register("observations", {
            maxLength: {
              value: 500,
              message: "Las observaciones no pueden exceder 500 caracteres",
            },
          })}
          rows={4}
          placeholder="Ej.: Estampado, bordado, botones extra"
          maxLength={500}
          className="w-full bg-[#F3F0F5] border-none rounded-xl p-4 text-sm text-gray-800 outline-none shadow-sm resize-none placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-colors"
        ></textarea>
        {errors.observations && (
          <p className="text-xs text-red-500 mt-1">
            {errors.observations.message as string}
          </p>
        )}
      </div>

      {/* Botón Revisar */}
      <button
        type="button"
        onClick={handleRevisar}
        disabled={isSaving}
        className={`w-full bg-[#8B709D] text-white font-bold py-4 rounded-xl hover:bg-[#7A5F8C] transition-colors shadow-lg ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSaving ? "Guardando..." : "Revisar"}
      </button>
    </div>
  );
}
