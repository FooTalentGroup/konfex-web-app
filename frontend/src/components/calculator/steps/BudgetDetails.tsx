import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Send } from "lucide-react";
import Image from "next/image";
import DatePicker from "@/components/common/DatePicker";
import { useBudgetMetadata } from "@/hooks/useBudgetMetadata";
import { getCurrentDateFormatted } from "@/utils/dateUtils";

interface BudgetDetailsProps {
  source?: "telegram" | "manual";
}

export default function BudgetDetails({
  source = "manual",
}: BudgetDetailsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const formId =
    (useWatch({ control, name: "id" as never }) as unknown as string) ||
    "000025";

  const deliveryDateValue =
    (useWatch({ control, name: "deliveryDate" }) as string) ||
    getCurrentDateFormatted();
  const { id: budgetId } = useBudgetMetadata();

  return (
    <div className="space-y-5 p-5 sm:p-6 bg-[#F4E7FD] rounded-b-[22px] min-h-[480px] text-[#51405F]">
      <div className="flex items-center mb-3 text-xs text-[#5A4A66]">
        <span className="text-[16px] font-bold leading-[1.31] text-black mr-auto">
          ID: {budgetId}
        </span>
        <div className="flex items-center gap-2 mx-auto translate-x-2">
          {source === "telegram" ? (
            <button className="flex items-center gap-1 bg-[#DDF2FF] px-3 py-1 rounded-lg text-[11px] font-semibold text-[#0D7DC5] border border-[#B9E2FF]">
              <Send size={14} className="text-[#0088cc]" />
              <span>Telegram</span>
            </button>
          ) : (
            <button className="flex items-center justify-center gap-1 px-1 h-[18px] min-w-[46px] bg-[#E9E7ED] rounded-full text-[12px] font-normal text-black border border-[#D5D2DB]">
              <Image
                src="/iconoManual.png"
                alt="Manual"
                width={12}
                height={12}
                className="h-[12px] w-[12px] object-contain"
              />
              <span>Manual</span>
            </button>
          )}
        </div>
        <span className="text-[13px] font-normal leading-[1.31] text-black ml-auto">
          Fecha: {deliveryDateValue}
        </span>
      </div>

      <div className="h-px bg-[#CEC2D6]"></div>

      <p className="text-[13px] font-normal leading-[1.31] text-[#4F3E5B]">
        Completa los datos principales del presupuesto.
      </p>

      <div>
        <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
          Título presupuesto<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("title", {
            maxLength: {
              value: 200,
              message: "El título no puede exceder 200 caracteres",
            },
          })}
          type="text"
          placeholder="Presupuesto para blusa verano"
          maxLength={200}
          className={`w-full bg-white border border-[#DCCBEB] rounded-lg h-10 px-3 text-sm text-[#1A151E] outline-none focus:border-[#9C7AB8] focus:ring-1 focus:ring-[#9C7AB8] placeholder:text-[#B7A6C6] ${
            errors.title
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">
            {errors.title.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
          Nombre cliente<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("clientName", {
            maxLength: {
              value: 100,
              message: "El nombre no puede exceder 100 caracteres",
            },
            pattern: {
              value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
              message: "El nombre solo puede contener letras y espacios",
            },
          })}
          type="text"
          placeholder="Ingresa el nombre del cliente"
          maxLength={100}
          className={`w-full bg-white border border-[#DCCBEB] rounded-lg h-10 px-3 text-sm text-[#1A151E] outline-none focus:border-[#9C7AB8] focus:ring-1 focus:ring-[#9C7AB8] placeholder:text-[#B7A6C6] ${
            errors.clientName
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
          }`}
        />
        {errors.clientName && (
          <p className="text-xs text-red-500 mt-1">
            {errors.clientName.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
          E-mail<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("clientEmail", {
            maxLength: {
              value: 100,
              message: "El email no puede exceder 100 caracteres",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un email válido",
            },
          })}
          type="email"
          placeholder="Ingresa el e-mail del cliente"
          maxLength={100}
          className={`w-full bg-white border border-[#DCCBEB] rounded-lg h-10 px-3 text-sm text-[#1A151E] outline-none focus:border-[#9C7AB8] focus:ring-1 focus:ring-[#9C7AB8] placeholder:text-[#B7A6C6] ${
            errors.clientEmail
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
          }`}
        />
        {errors.clientEmail && (
          <p className="text-xs text-red-500 mt-1">
            {errors.clientEmail.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
            Teléfono<span className="text-[#8B709D]">*</span>
          </label>
          <input
            {...register("clientPhone", {
              maxLength: {
                value: 16,
                message: "El teléfono no puede exceder 16 caracteres",
              },
              pattern: {
                value: /^[0-9\-\s\+\(\)]+$/,
                message:
                  "El teléfono solo puede contener números, guiones, espacios y paréntesis",
              },
            })}
            type="tel"
            placeholder="+54 0 11 XXXXX XXXX"
            maxLength={16}
            className={`w-full bg-white border border-[#DCCBEB] rounded-lg h-10 px-3 text-sm text-[#1A151E] outline-none focus:border-[#9C7AB8] focus:ring-1 focus:ring-[#9C7AB8] placeholder:text-[#B7A6C6] ${
              errors.clientPhone
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
            }`}
          />
          {errors.clientPhone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.clientPhone.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
            Fecha entrega<span className="text-[#8B709D]">*</span>
          </label>
          <Controller
            control={control}
            name="deliveryDate"
            rules={{ required: "La fecha de entrega es requerida" }}
            render={({ field, fieldState }) => (
              <div>
                <DatePicker
                  value={field.value || getCurrentDateFormatted()}
                  onChange={field.onChange}
                  placeholder={getCurrentDateFormatted()}
                  error={!!fieldState.error}
                  minDate={new Date()}
                  className="!w-full !h-10 !px-3 !bg-white !border !border-[#DCCBEB] !rounded-lg !text-sm !leading-[1.31] !text-[#1A151E] !placeholder:text-[#B7A6C6] !outline-none !focus:border-[#9C7AB8] !focus:ring-1 !focus:ring-[#9C7AB8]"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      <p className="text-[12px] font-normal leading-[1.31] text-[#8B709D] mt-1">
        *La fecha de entrega se confirmará una vez aprobado el presupuesto.
      </p>

      <div>
        <label className="block text-[14px] font-bold leading-[1.31] text-[#1A151E] mb-1.5">
          Ganancia deseada (%)
        </label>
        <div className="h-px bg-[#B5A4C1] border-b border-[#CEC2D6] mt-1 mb-3"></div>
        <div className="relative">
          <input
            {...register("desiredProfit", {
              valueAsNumber: true,
              min: {
                value: 0,
                message: "La ganancia no puede ser negativa",
              },
              max: {
                value: 100,
                message: "La ganancia no puede ser mayor a 100%",
              },
            })}
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0-100"
            onWheel={(e) => e.currentTarget.blur()}
            className={`w-full bg-white border rounded-lg h-10 px-3 pr-10 text-sm text-[#1A151E] outline-none focus:ring-1 placeholder:text-[#B7A6C6] ${
              errors.desiredProfit
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#DCCBEB] focus:border-[#9C7AB8] focus:ring-[#9C7AB8]"
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6B8A] text-sm font-semibold pointer-events-none">
            %
          </span>
        </div>
        {errors.desiredProfit && (
          <p className="text-xs text-red-500 mt-1">
            {errors.desiredProfit.message as string}
          </p>
        )}
        <p className="text-[12px] font-normal leading-[1.31] text-[#8B709D] mt-2">
          Este porcentaje se aplica para calcular el precio final de tu prenda.
        </p>
      </div>
    </div>
  );
}
