import { useFormContext, Controller } from "react-hook-form";
import { Hand, Send } from "lucide-react";
import DatePicker from "@/components/common/DatePicker";
import { useBudgetMetadata } from "@/hooks/useBudgetMetadata";

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
  const { id: budgetId } = useBudgetMetadata();

  return (
    <div className="space-y-4 p-5 bg-[#F3F0F5] rounded-b-2xl min-h-[400px]">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span className="font-bold text-gray-800">ID: {budgetId}</span>
        <div className="flex items-center gap-2">
          {source === "telegram" ? (
            <button className="flex items-center gap-1 bg-[#C9ECFF] px-2 py-1 rounded text-xs font-medium hover:bg-[#BBDEFB] transition-colors">
              <Send size={14} className="text-[#0088cc]" />
              <span>Telegram</span>
            </button>
          ) : (
            <button className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors">
              <Hand size={14} />
              <span>Manual</span>
            </button>
          )}
          <span>
            Fecha:{" "}
            {new Date().toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        Completa los datos principales del presupuesto.
      </p>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
          placeholder="Ingresa el título del presupuesto"
          maxLength={200}
          className={`w-full bg-white border rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 ${
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
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
          className={`w-full bg-white border rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 ${
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
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
          className={`w-full bg-white border rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 ${
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
            placeholder="X-XXXX-XXXX"
            maxLength={16}
            className={`w-full bg-white border rounded-lg p-3 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 ${
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
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Fecha entrega<span className="text-[#8B709D]">*</span>
          </label>
          <Controller
            control={control}
            name="deliveryDate"
            rules={{ required: "La fecha de entrega es requerida" }}
            render={({ field, fieldState }) => (
              <div>
                <DatePicker
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="DD/MM/YYYY"
                  error={!!fieldState.error}
                  minDate={new Date()}
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

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        *La fecha de entrega se confirmará una vez aprobado el presupuesto.
      </p>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Ganancia deseada (%)
        </label>
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
            className={`w-full bg-white border rounded-lg p-3 pr-8 text-sm text-gray-700 outline-none focus:ring-1 placeholder:text-gray-400 ${
              errors.desiredProfit
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#D5A1F7] focus:border-[#B65CF2] focus:ring-[#B65CF2]"
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-medium pointer-events-none">
            %
          </span>
        </div>
        {errors.desiredProfit && (
          <p className="text-xs text-red-500 mt-1">
            {errors.desiredProfit.message as string}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Este porcentaje se aplica para calcular el precio final de tu prenda.
        </p>
      </div>
    </div>
  );
}
