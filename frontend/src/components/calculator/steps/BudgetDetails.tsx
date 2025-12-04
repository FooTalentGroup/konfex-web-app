import { useFormContext, Controller } from "react-hook-form";
import { Calendar, Hand, Send, ChevronDown } from "lucide-react";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";

interface BudgetDetailsProps {
  source?: "telegram" | "manual";
}

export default function BudgetDetails({
  source = "manual",
}: BudgetDetailsProps) {
  const { register, control } = useFormContext();
  const { gastosNegocio, loading: loadingGastos } = useGastosNegocio();

  return (
    <div className="space-y-4 p-5 bg-[#F3F0F5] rounded-b-2xl min-h-[400px]">
      {/* Header con ID, Manual/Telegram y Fecha */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span className="font-bold text-gray-800">ID: XXXX</span>
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
          <span>Fecha: DD/MM/YYYY</span>
        </div>
      </div>

      {/* Instrucciones */}
      <p className="text-sm text-gray-700 mb-4">
        Completa los datos principales del presupuesto.
      </p>

      {/* Título presupuesto */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Título presupuesto<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="Ingresa el título del presupuesto"
          className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
        />
      </div>

      {/* Nombre cliente */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Nombre cliente<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("clientName")}
          type="text"
          placeholder="Ingresa el nombre del cliente"
          className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
        />
      </div>

      {/* E-mail */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          E-mail<span className="text-[#8B709D]">*</span>
        </label>
        <input
          {...register("clientEmail")}
          type="email"
          placeholder="Ingresa el e-mail del cliente"
          className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
        />
      </div>

      {/* Teléfono y Fecha entrega */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Teléfono<span className="text-[#8B709D]">*</span>
          </label>
          <input
            {...register("clientPhone")}
            type="tel"
            placeholder="X-XXXX-XXXX"
            className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Fecha entrega<span className="text-[#8B709D]">*</span>
          </label>
          <div className="relative">
            <input
              {...register("deliveryDate")}
              type="text"
              placeholder="DD/MM/YYYY"
              className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 pr-10 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
            />
            <Calendar
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Nota sobre fecha de entrega */}
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        *La fecha de entrega se confirmará una vez aprobado el presupuesto.
      </p>

      {/* Gastos de negocio */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Gastos de negocio<span className="text-[#8B709D]">*</span>
        </label>
        <Controller
          control={control}
          name="gastosNegocioId"
          rules={{ required: "Los gastos de negocio son requeridos" }}
          render={({ field, fieldState }) => (
            <div className="relative">
              <select
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 pr-10 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] appearance-none"
                disabled={loadingGastos}
              >
                <option value="">Selecciona gastos de negocio</option>
                {gastosNegocio.map((gasto) => (
                  <option key={gasto.id} value={gasto.id}>
                    {gasto.nombre} ({gasto.porcentaje}%)
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
              {fieldState.error && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Selecciona la configuración de gastos de negocio para este
          presupuesto.
        </p>
      </div>

      {/* Ganancia deseada */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Ganancia deseada (%)
        </label>
        <div className="relative">
          <input
            {...register("desiredProfit", { valueAsNumber: true })}
            type="number"
            placeholder="0-100"
            className="w-full bg-white border border-[#D5A1F7] rounded-lg p-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#B65CF2] focus:ring-1 focus:ring-[#B65CF2] placeholder:text-gray-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-medium pointer-events-none">
            %
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Este porcentaje se aplica para calcular el precio final de tu prenda.
        </p>
      </div>
    </div>
  );
}
