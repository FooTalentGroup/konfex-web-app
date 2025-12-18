import React, { useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import CircularAddButton from "@/components/common/CircularAddButton";
import BudgetTotalBadge from "../BudgetTotalBadge";
import { presupuestoService } from "@/services/presupuesto.service";
import { clienteService } from "@/services/cliente.service";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";
import { mapFormDataToBackend } from "@/utils/presupuestoMapper";
import { useToast } from "@/contexts/ToastContext";
import {
  normalizeTrim,
  validatePositiveNumber,
  validateObservations,
} from "@/utils/budget.validators";


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

  const shippingFee = useWatch({ control, name: "shippingFee" }) || "";

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

      if (!currentBudgetData.title?.trim()) {
        showError("Por favor ingresa un título para el presupuesto");
        return;
      }

      if (!currentBudgetData.clientName?.trim()) {
        showError("Por favor ingresa el nombre del cliente");
        return;
      }

      let finalGastosNegocioId = gastosNegocioId;
      if (!finalGastosNegocioId && gastosNegocio.length > 0) {
        finalGastosNegocioId = Number(gastosNegocio[0].id);
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
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al procesar el cliente. Por favor intenta nuevamente.";
          showError(errorMessage);
          return;
        }
      }

      if (!gastosNegocio || gastosNegocio.length === 0) {
        showError(
          "No se encontraron gastos de negocio configurados. Por favor contacta al administrador."
        );
        return;
      }

      const payload = mapFormDataToBackend(
        {
          ...currentBudgetData,
          clienteId,
          gastosNegocioId: finalGastosNegocioId,
          materials: (currentBudgetData.materials || []) as Material[],
          extras: (currentBudgetData.extras || []) as Extra[],
        } as Parameters<typeof mapFormDataToBackend>[0],
        gastosNegocio.map((g) => ({
          id: Number(g.id),
          porcentaje: g.porcentaje,
        })),
        origen
      );

      if (isEditMode && presupuestoId) {
        showInfo("Actualizando presupuesto...");
        const updatedPresupuesto = await presupuestoService.update(
          presupuestoId,
          payload
        );

        showSuccess(
          `Presupuesto #${updatedPresupuesto.numeroPresupuesto} actualizado exitosamente`,
          4000
        );

        setTimeout(() => {
          router.push(`/presupuestos/${updatedPresupuesto.id}`);
        }, 1500);
      } else {
        showInfo("Creando presupuesto...");
        const createdPresupuesto = await presupuestoService.create(payload);

        showSuccess(
          `Presupuesto #${createdPresupuesto.numeroPresupuesto} creado exitosamente`,
          4000
        );

        setTimeout(() => {
          router.push(`/presupuestos/${createdPresupuesto.id}`);
        }, 1500);
      }
    } catch (error) {
      let errorMessage = "Error desconocido al crear presupuesto";

      if (error instanceof Error) {
        const message = error.message;

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
      <div className="mb-4 px-[14px] -mt-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[16px] leading-[1.31] text-[#000000]">
            Costos adicionales:
          </span>
          <BudgetTotalBadge
            amount={total}
            className="text-[16px]! font-bold text-[#C071F4]!"
          />
        </div>
        <div className="h-px bg-[#CEC2D6] mt-0 ml-1 mr-[8px] translate-y-[-2px]"></div>
        <p className="text-[13px] leading-[1.31] text-[#4F3E5B] ml-1 mt-3">
          Suma los extras que necesitas.
        </p>
      </div>

      <div className="mb-6 bg-[#F3F0F5] border-[0.5px] border-[#CEC2D6] rounded-[10px] px-2 pt-2 pb-5 max-w-[390px] sm:max-w-[430px] mx-auto space-y-2">
        <label className="block text-[13px] leading-[1.31] font-bold text-[#1A151E] ml-1">
          Tarifa de envío
        </label>
        <div className="relative group">
          <input
            type="number"
            {...register("shippingFee", {
              valueAsNumber: true,
              validate: validatePositiveNumber,
            })}
            placeholder="Ingresa la tarifa de envío"
            className="w-full h-[40px] bg-white border border-[#CEC2D6] rounded-[10px] px-3 pr-9 text-sm outline-none font-normal text-[#1A151E] text-left focus:border-[#C071F4] focus:ring-2 focus:ring-[#C071F4]/10 transition-all placeholder:text-[#B5A4C1]"
            min={0}
            step="0.01"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <Image
              src="/presupuestoPrecio.png"
              alt="$"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </span>
        </div>
      </div>

      <div className="bg-[#F3F0F5] border border-[#CEC2D6] rounded-[10px] px-2 pt-2 pb-[30px] max-w-[390px] sm:max-w-[480px] mx-auto space-y-3">
        <div className="space-y-2">
          <label className="block text-[13px] leading-[1.31] font-bold text-[#1A151E] ml-1">
            Costo adicional
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= 100) {
                setName(e.target.value);
              }
            }}
            placeholder="Ej.: Estampado, botones adicionales"
            maxLength={100}
            className="w-full h-[40px] bg-white border border-[#CEC2D6] rounded-[10px] px-3 text-sm outline-none font-normal text-[#1A151E] placeholder:text-[#B5A4C1] focus:border-[#C071F4] focus:ring-2 focus:ring-[#C071F4]/10 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] leading-[1.31] font-bold text-[#1A151E] mb-1.5 ml-1">
              Cantidad
            </label>
            <div className="flex items-center bg-white rounded-[6px] h-[40px] px-3 justify-between border border-[#CEC2D6] w-full sm:w-[144px]">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className={`p-2 rounded-lg transition-all ${qty <= 1
                  ? "text-[#0F172A] opacity-85 cursor-not-allowed"
                  : "text-[#0F172A] hover:text-[#0F172A] hover:bg-white"
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
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="00"
                className="w-12 bg-white text-center text-sm outline-none font-normal text-[#1A151E] placeholder:text-[#B5A4C1]"
                min="1"
                max="9999"
                step="1"
              />
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-2 text-[#0F172A] hover:text-[#0F172A] hover:bg-white rounded-lg transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[13px] leading-[1.31] font-bold text-[#1A151E] mb-1.5 ml-1">
              Monto
            </label>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === "" || inputValue === "-") {
                    if (inputValue === "-") {
                      return;
                    }
                    setAmount("");
                  } else {
                    const val = parseFloat(inputValue);
                    if (!isNaN(val) && val >= 0) {
                      setAmount(inputValue);
                    }
                  }
                }}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val) || val < 0) {
                    setAmount("");
                  }
                }}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Ingresa el monto"
                className="w-full sm:w-[206px] h-[40px] bg-white border border-[#CEC2D6] rounded-[6px] px-3 pr-9 text-sm outline-none font-normal text-[#1A151E] text-left focus:border-[#C071F4] focus:ring-2 focus:ring-[#C071F4]/10 transition-all placeholder:text-[#B5A4C1]"
                min="0"
                step="0.01"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <Image
                  src="/presupuestoPrecio.png"
                  alt="$"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center -mt-4 mb-6">
        <CircularAddButton
          onClick={handleAddExtra}
          variant="centered"
          label="Agregar extra"
          hideLines
          iconSize={36}
          className="scale-95"
          labelClassName="text-[#6A5379] text-[13px] leading-[1.31] font-normal mt-1 text-center"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[14px] font-bold leading-[1.31] text-[#4F3E5B] mb-3 ml-1">
          Lista de prendas agregadas:
        </label>
        <div className="space-y-3">
          {fields.map((field, index) => {
            const extra = field as unknown as Extra;
            return (
              <div
                key={field.id}
                className="bg-[#EDE9F1] h-[44px] w-full max-w-full sm:max-w-[430px] mx-auto rounded-[10px] flex items-center justify-between text-sm border border-[#CEC2D6] px-[10px] gap-[27px]"
              >
                <span className="font-normal text-base text-[#000000] leading-[1.31]">
                  {extra.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[#000000] font-normal text-[13px] leading-[1.31]">
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

      <div className="mb-8">
        <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-2 ml-1">
          Observaciones
        </label>
        <textarea
          {...register("observations", {
            setValueAs: normalizeTrim,
            validate: validateObservations,
          })}
          rows={4}
          placeholder="Ej.: Estampado, bordado, botones extra"
          maxLength={500}
          className="w-full bg-white border border-[#CEC2D6] rounded-[6px] px-3 py-2 text-sm text-[#1A151E] outline-none resize-none placeholder:text-[#B5A4C1] focus:border-[#C071F4] focus:ring-2 focus:ring-[#C071F4]/10 transition-all"
        ></textarea>
        {errors.observations && (
          <p className="text-xs text-red-500 mt-1">
            {errors.observations.message as string}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleRevisar}
        disabled={isSaving}
        className={`w-full max-w-[390px] sm:max-w-[480px] mx-auto h-[45px] bg-[#B65CF2] text-[#FEFCFF] text-[13px] leading-[1.31] font-normal rounded-[9999px] transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {isSaving ? "Guardando..." : "Revisar"}
      </button>
    </div>
  );
}
