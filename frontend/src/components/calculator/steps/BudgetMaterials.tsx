import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Trash2, Plus, Minus, ChevronDown, CircleDollarSign } from 'lucide-react';

export default function BudgetMaterials() {
  const { control, watch } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials"
  });


  const [tempName, setTempName] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempVariants, setTempVariants] = useState<{size: string, quantity: number}[]>([]);
  
  const [currentSize, setCurrentSize] = useState('M');
  const [currentQty, setCurrentQty] = useState(12);


  const addVariant = () => {
    if (currentQty > 0) {
      setTempVariants([...tempVariants, { size: currentSize, quantity: currentQty }]);
      setCurrentQty(1); 
    }
  };

  const removeVariant = (index: number) => {
    setTempVariants(tempVariants.filter((_, i) => i !== index));
  };

 
  const handleAddMaterial = () => {
    const finalName = tempName.trim() || "Prenda nueva";
    let finalVariants = [...tempVariants];
    
   
    if (finalVariants.length === 0 && currentQty > 0) {
        finalVariants.push({ size: currentSize, quantity: currentQty });
    }

    if (!tempPrice || finalVariants.length === 0) return;

    append({
      name: finalName,
      unitPrice: parseFloat(tempPrice) || 0,
      variants: finalVariants
    });

    setTempName('');
    setTempPrice('');
    setTempVariants([]);
    setCurrentQty(12);
  };


  const materials = watch('materials') || [];
  const totalMaterials = materials.reduce((sum: number, item: any) => {
    const totalQty = item.variants?.reduce((acc: number, v: any) => acc + v.quantity, 0) || 0;
    return sum + (totalQty * item.unitPrice);
  }, 0);

  return (
    <div className="p-5 pb-10 font-lato">
      

      <div className="flex justify-between items-center mb-6 px-1">
        <span className="font-bold text-gray-900 text-base">Total de materiales</span>
        <div className="flex items-center gap-2 bg-[#F4E7FD] px-3 py-1.5 rounded-lg border border-[#F4E7FD]">
            <CircleDollarSign size={18} className="text-[#8B709D]" strokeWidth={2.5} />
            <span className="font-bold text-[#8B709D] text-lg font-lato">
                {totalMaterials.toLocaleString('es-AR')}
            </span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {fields.map((field: any, index) => {
            return (
                <div key={field.id} className="bg-[#F3F0F5] p-4 rounded-xl flex justify-between items-start text-sm border border-transparent hover:border-gray-200 transition-colors">

                    <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-800 text-base">{field.name}</span>
                        <div className="text-gray-500 text-xs flex flex-wrap gap-2">
                            {field.variants?.map((v: any, i: number) => (
                                <span key={i} className="bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                                    {v.size}
                                </span>
                            ))}
                        </div>
                    </div>


                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-end gap-1">
                            {field.variants?.map((v: any, i: number) => (
                                <span key={i} className="font-bold text-gray-700">{v.quantity} uds.</span>
                            ))}
                        </div>
                        <button 
                            onClick={() => remove(index)} 
                            className="text-gray-400 hover:text-red-500 transition-colors mt-0.5 p-1 hover:bg-white rounded-full"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            );
        })}
        {fields.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-2 italic font-light">
                No hay materiales agregados
            </div>
        )}
      </div>


      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative mb-6">
        

        <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre prenda</label>
            <div className="relative">
                <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Ej.: Blusa manga larga" 
                    className="w-full bg-[#F3F0F5] rounded-xl p-3.5 pr-10 text-sm outline-none text-gray-800 placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-colors"
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
        </div>


        <div className="space-y-2 mb-4">
            {tempVariants.map((v, i) => (
                <div key={i} className="flex justify-between items-center bg-[#F3F0F5] p-3 rounded-lg text-sm group hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-700">Talla: {v.size}</span>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium">Cantidad: {v.quantity}</span>
                        <button type="button" onClick={() => removeVariant(i)}>
                            <Trash2 size={16} className="text-gray-400 group-hover:text-red-500 transition-colors"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>


        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Talla</label>
                <div className="relative">
                    <select 
                        value={currentSize}
                        onChange={(e) => setCurrentSize(e.target.value)}
                        className="w-full bg-[#F3F0F5] rounded-xl p-3 text-sm appearance-none outline-none text-gray-700 font-medium cursor-pointer"
                    >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Cantidad</label>
                <div className="flex items-center bg-[#F3F0F5] rounded-xl p-1 justify-between">
                    <button 
                        type="button" 
                        onClick={() => setCurrentQty(Math.max(1, currentQty - 1))} 
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-all"
                    >
                        <Minus size={16}/>
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
                        <Plus size={16}/>
                    </button>
                </div>
            </div>
        </div>


        <div className="flex justify-center pt-2 pb-2 mb-2">
            <button 
                type="button"
                onClick={addVariant}
                className="w-10 h-10 bg-[#F3F0F5] rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
            >
                <Plus size={20} />
            </button>
        </div>


        <div className="pb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Precio unitario</label>
            <div className="relative group">
                <input 
                    type="number" 
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    placeholder="35.000" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pr-8 text-sm outline-none font-bold text-gray-800 shadow-sm focus:border-[#8B709D] focus:ring-2 focus:ring-[#8B709D]/10 transition-all placeholder:font-normal"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-[#8B709D] transition-colors">$</span>
            </div>
        </div>


        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
             <button 
                type="button"
                onClick={handleAddMaterial}
                className="w-14 h-14 bg-[#F2BB5C] rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_0_rgba(242,187,92,0.39)] hover:bg-[#E0A84B] transition-all hover:scale-105 border-[6px] border-[#F3F0F5]"
             >
                <Plus size={28} strokeWidth={3} />
            </button>
        </div>

      </div>
      

      <div className="h-8"></div>
    </div>
  );
}