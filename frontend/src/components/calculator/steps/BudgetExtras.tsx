import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Trash2, Plus, Minus, CircleDollarSign } from 'lucide-react';

export default function BudgetExtras() {
  const { control, watch, register } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras"
  });

  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState('');

  const handleAddExtra = () => {
    if (!name.trim()) return;
    const finalAmount = parseFloat(amount) || 0;
    append({ name: name, quantity: qty, amount: finalAmount });
    setName('');
    setQty(1);
    setAmount('');
  };

  const extras = watch('extras') || [];
  const totalExtras = extras.reduce((sum: number, item: any) => {
    return sum + (item.quantity * item.amount);
  }, 0);

  return (
    <div className="p-5 pb-10 font-lato">
      

      <div className="flex justify-between items-center mb-6 px-1">
        <span className="font-bold text-gray-900 text-base">Costos adicionales</span>
        <div className="flex items-center gap-2 bg-[#F4E7FD] px-3 py-1.5 rounded-lg border border-[#F4E7FD]">
            <CircleDollarSign size={18} className="text-[#8B709D]" strokeWidth={2.5} />
            <span className="font-bold text-[#8B709D] text-lg font-lato">
                {totalExtras.toLocaleString('es-AR')}
            </span>
        </div>
      </div>


      <div className="space-y-3 mb-8">
        {fields.map((field: any, index) => (
            <div key={field.id} className="bg-[#F3F0F5] p-4 rounded-xl flex justify-between items-center text-sm border border-transparent hover:border-gray-200 transition-colors">
                <span className="font-bold text-gray-800 text-base">{field.name}</span>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium text-sm">{field.quantity} uds.</span>
                    <button 
                        onClick={() => remove(index)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-white rounded-full"
                    >
                        <Trash2 size={18}/>
                    </button>
                </div>
            </div>
        ))}
        {fields.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-2 italic font-light">
                Sin costos adicionales
            </div>
        )}
      </div>


      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-6">
        

        <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Costo adicional</label>
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
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Cantidad</label>
                <div className="flex items-center bg-[#F3F0F5] rounded-xl p-1 justify-between">
                    <button 
                        type="button" 
                        onClick={() => setQty(Math.max(1, qty - 1))} 
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
                    >
                        <Minus size={16}/>
                    </button>
                    <input 
                        type="number" 
                        value={qty} 
                        onChange={(e) => setQty(parseInt(e.target.value) || 0)} 
                        className="w-12 bg-transparent text-center text-sm outline-none font-bold text-gray-800" 
                    />
                    <button 
                        type="button" 
                        onClick={() => setQty(qty + 1)} 
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
                    >
                        <Plus size={16}/>
                    </button>
                </div>
            </div>


            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Monto</label>
                <div className="relative group">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="000.000" 
                        className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 text-right shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#8B709D] transition-colors">$</span>
                </div>
            </div>
        </div>


        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
             <button 
                type="button" 
                onClick={handleAddExtra} 
                className="w-14 h-14 bg-[#F2BB5C] rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_0_rgba(242,187,92,0.39)] hover:bg-[#E0A84B] transition-all hover:scale-105 border-[6px] border-[#F3F0F5]"
             >
                <Plus size={28} strokeWidth={3} />
            </button>
        </div>
      </div>


      <div className="mt-8">
        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Observaciones</label>
        <textarea 
            {...register('observations')}
            rows={4}
            placeholder="Ej. Estampado adicional - camisa manda larga"
            className="w-full bg-[#F3F0F5] border-none rounded-xl p-4 text-sm text-gray-800 outline-none shadow-sm resize-none placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-colors"
        ></textarea>
      </div>
    </div>
  );
}