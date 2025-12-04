import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Minus } from "lucide-react";
import CircularAddButton from "@/components/common/CircularAddButton";
import BudgetTotalBadge from "../BudgetTotalBadge";

interface Extra {
  name: string;
  quantity: number;
  amount: number;
}

export default function BudgetExtras() {
  const { control, watch, register } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras",
  });

  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  const handleAddExtra = () => {
    if (!name.trim()) return;
    const finalAmount = parseFloat(amount) || 0;
    append({ name: name, quantity: qty, amount: finalAmount });
    setName("");
    setQty(1);
    setAmount("");
  };

  const extras = watch("extras") || [];
  const shippingFeeValue = parseFloat(shippingFee) || 0;
  const totalExtras = extras.reduce(
    (sum: number, item: { quantity: number; amount: number }) => {
      return sum + item.quantity * item.amount;
    },
    0
  );
  const total = totalExtras + shippingFeeValue;

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
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            placeholder="000.000"
            className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 text-right shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
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
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej.: Estampado, botones adicionales"
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
                  } else {
                    setQty(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) {
                    setQty(1);
                  }
                }}
                placeholder="00"
                className="w-12 bg-transparent text-center text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400"
                min="1"
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
                onChange={(e) => setAmount(e.target.value)}
                placeholder="000.000"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 text-right shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
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
          {...register("observations")}
          rows={4}
          placeholder="Ej.: Estampado, bordado, botones extra"
          className="w-full bg-[#F3F0F5] border-none rounded-xl p-4 text-sm text-gray-800 outline-none shadow-sm resize-none placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-colors"
        ></textarea>
      </div>

      {/* Botón Revisar */}
      <button
        type="button"
        className="w-full bg-[#8B709D] text-white font-bold py-4 rounded-xl hover:bg-[#7A5F8C] transition-colors shadow-lg"
      >
        Revisar
      </button>
    </div>
  );
}
