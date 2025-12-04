import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { MoreVertical, FileDown, FolderInput, Send, X } from 'lucide-react';
import NavigationTabs from '../ui/NavigationTabs';
import { presupuestoService } from '@/services/presupuesto.service';
import { clienteService } from '@/services/cliente.service';
import { useGastosNegocio } from '@/hooks/useGastosNegocio';
import { mapFormDataToBackend } from '@/utils/presupuestoMapper';
import { useToast } from '@/contexts/ToastContext'; 

export default function BudgetSummaryHeader() {
  const { control, getValues, watch } = useFormContext(); 
  const router = useRouter();
  const { gastosNegocio } = useGastosNegocio();
  const { showSuccess, showError, showWarning } = useToast();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const materials = useWatch({ control, name: 'materials' }) || [];
  const extras = useWatch({ control, name: 'extras' }) || [];
  const gastosNegocioId = useWatch({ control, name: 'gastosNegocioId' });
  const desiredProfit = useWatch({ control, name: 'desiredProfit' }) || 0;
  
  const formData = watch(); 

  const totalMaterialsCost = materials.reduce((sum: number, item: any) => {
    const totalQty = item.variants?.reduce((qSum: number, v: any) => qSum + (v.quantity || 0), 0) || 0;
    return sum + (totalQty * (item.unitPrice || 0));
  }, 0);

  const totalExtrasCost = extras.reduce((sum: number, item: any) => {
    return sum + ((item.quantity || 0) * (item.amount || 0));
  }, 0);

  const directCost = totalMaterialsCost + totalExtrasCost;
  
  // Calcular costos indirectos y ganancias si tenemos gastosNegocioId
  const selectedGastosNegocio = gastosNegocio.find(g => g.id === gastosNegocioId);
  const indirectCosts = selectedGastosNegocio 
    ? (directCost * selectedGastosNegocio.porcentaje) / 100 
    : 0;
  const profit = (directCost * desiredProfit) / 100;
  const grandTotal = directCost + indirectCosts + profit;


  const handleSendToBudgets = async () => {
    try {
      setIsSaving(true);
      const currentBudgetData = getValues();

      // Validaciones básicas
      if (!currentBudgetData.title?.trim()) {
        showError("Por favor ingresa un título para el presupuesto");
        setIsMenuOpen(false);
        return;
      }

      if (!currentBudgetData.clientName?.trim()) {
        showError("Por favor ingresa el nombre del cliente");
        setIsMenuOpen(false);
        return;
      }

      if (!gastosNegocioId) {
        showError("Por favor selecciona los gastos de negocio");
        setIsMenuOpen(false);
        return;
      }

      if (materials.length === 0) {
        showError("Por favor agrega al menos un material/prenda");
        setIsMenuOpen(false);
        return;
      }

      // Validar que todos los materiales tengan productoId
      const materialesSinProductoId = materials.filter((m: any) => !m.productoId);
      if (materialesSinProductoId.length > 0) {
        const nombres = materialesSinProductoId.map((m: any) => m.name).join(", ");
        showError(
          `Los siguientes materiales no tienen producto asociado. Por favor selecciónalos desde el autocomplete: ${nombres}`,
          5000
        );
        setIsMenuOpen(false);
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
          // Guardar el clienteId en el formulario para futuras referencias
          // (esto requeriría setValue del form, pero por ahora solo lo usamos para el payload)
        } catch (error) {
          console.error("Error al obtener/crear cliente:", error);
          const errorMessage = error instanceof Error 
            ? error.message 
            : "Error al procesar el cliente. Por favor intenta nuevamente.";
          showError(errorMessage);
          setIsMenuOpen(false);
          return;
        }
      }

      // Obtener gastos de negocio seleccionados
      const selectedGastos = gastosNegocio.find(g => g.id === gastosNegocioId);
      if (!selectedGastos) {
        showError("No se encontraron los gastos de negocio seleccionados. Por favor recarga la página.");
        setIsMenuOpen(false);
        return;
      }

      // Mapear datos del formulario al formato del backend
      const payload = mapFormDataToBackend(
        {
          ...currentBudgetData,
          clienteId,
          gastosNegocioId,
        },
        selectedGastos
      );

      // Crear presupuesto en el backend
      showInfo("Creando presupuesto...");
      const createdPresupuesto = await presupuestoService.create(payload);

      console.log("✅ Presupuesto creado exitosamente:", createdPresupuesto);
      
      showSuccess(
        `Presupuesto #${createdPresupuesto.numeroPresupuesto} creado exitosamente`,
        4000
      );
      
      // Redirigir a presupuestos después de un breve delay para que se vea el toast
      setTimeout(() => {
        router.push('/presupuestos');
      }, 1500);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error al crear presupuesto:", error);
      
      // Mejorar mensajes de error específicos
      let errorMessage = "Error desconocido al crear presupuesto";
      
      if (error instanceof Error) {
        const message = error.message;
        
        // Mensajes específicos según el tipo de error
        if (message.includes("productoId")) {
          errorMessage = "Uno o más materiales no tienen producto asociado. Por favor selecciónalos desde el autocomplete.";
        } else if (message.includes("cliente")) {
          errorMessage = "Error al procesar el cliente. Verifica que el nombre sea válido.";
        } else if (message.includes("gastosNegocioId")) {
          errorMessage = "Error con los gastos de negocio. Por favor selecciona uno válido.";
        } else if (message.includes("API 400") || message.includes("validación")) {
          errorMessage = "Los datos ingresados no son válidos. Por favor revisa el formulario.";
        } else if (message.includes("API 404")) {
          errorMessage = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
        } else if (message.includes("API 500")) {
          errorMessage = "Error interno del servidor. Por favor intenta nuevamente más tarde.";
        } else {
          errorMessage = message;
        }
      }
      
      showError(errorMessage, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {

    window.print();
    setIsMenuOpen(false);
  };

  const handleSendToTelegram = () => {
    const data = getValues();
    const message = `🚀 *Presupuesto KONFEX*\n📄 *${data.title || 'Sin título'}*\n👤 *${data.clientName || 'Cliente'}*\n\n💰 Materiales: $${totalMaterialsCost}\n💰 Extras: $${totalExtrasCost}\n🏆 *TOTAL: $${grandTotal}*`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('https://konfex.app')}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    setIsMenuOpen(false);
  };

  return (
    <>

      <div className="relative print:hidden">
        
        <div className="absolute inset-0 bg-[#8B709D] rounded-b-[30px] shadow-lg z-0 pointer-events-none" />

        <div className="relative z-20 text-white pt-2 pb-12">
          <div className="px-6 mb-6">
            <NavigationTabs />
          </div>

          <div className="text-center px-6 relative">
            <p className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wider">Total presupuesto</p>
            
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              $ {grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h2>
            
            <div className="absolute right-0 top-8">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 relative z-50 ${isMenuOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}
              >
                {isMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}/>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <button 
                      onClick={handleSendToBudgets} 
                      disabled={isSaving}
                      className={`flex items-center gap-3 w-full p-3 hover:bg-[#F4E7FD] rounded-lg text-sm text-gray-700 transition-colors font-medium group ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <div className="p-2 bg-[#F3F0F5] text-[#8B709D] rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FolderInput size={18} />
                      </div>
                      <span>{isSaving ? 'Guardando...' : 'Guardar en Presupuestos'}</span>
                    </button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-3 w-full p-3 hover:bg-[#F4E7FD] rounded-lg text-sm text-gray-700 transition-colors font-medium mt-1 group">
                      <div className="p-2 bg-[#F3F0F5] text-[#8B709D] rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all"><FileDown size={18} /></div>
                      <span>Descargar PDF</span>
                    </button>
                    <button onClick={handleSendToTelegram} className="flex items-center gap-3 w-full p-3 hover:bg-[#F4E7FD] rounded-lg text-sm text-gray-700 transition-colors font-medium mt-1 group">
                      <div className="p-2 bg-[#F3F0F5] text-[#0088cc] rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all"><Send size={18} className="ml-0.5" /></div>
                      <span>Enviar a Telegram</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center gap-8 text-sm border-t border-white/20 pt-4 mx-4">
              <div>
                <p className="text-white/70 text-xs mb-1 uppercase">Costos indirectos</p>
                <p className="font-bold text-lg">$ {indirectCosts.toLocaleString('es-AR')}</p>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div>
                <p className="text-white/70 text-xs mb-1 uppercase">Ganancias</p>
                <p className="font-bold text-lg">$ {profit.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA DE IMPRESIÓN PDF */}
      {/* Esta sección está oculta en pantalla (hidden) y solo aparece al imprimir (print:block) */}
      <div className="hidden print:block fixed inset-0 bg-white z-9999 p-8 text-black font-lato overflow-y-auto">
          

          <div className="flex justify-between items-end border-b-2 border-[#8B709D] pb-4 mb-8">
              <div>
                  <h1 className="text-4xl font-bold text-[#8B709D] mb-1 tracking-tight">KONFEX</h1>
                  <p className="text-sm text-gray-500 font-medium">Presupuesto Oficial</p>
              </div>
              <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">Fecha: {new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">ID Ref: {formData.id || '000025'}</p>
              </div>
          </div>


          <section className="mb-8">
              <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
                  1. Información del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  <div className="flex flex-col"><span className="text-gray-500 text-xs">Título Presupuesto</span><span className="font-bold">{formData.title || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500 text-xs">Cliente</span><span className="font-bold">{formData.clientName || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500 text-xs">Email</span><span>{formData.clientEmail || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-gray-500 text-xs">Teléfono</span><span>{formData.clientPhone || '-'}</span></div>
                  <div className="col-span-2 flex flex-col mt-2"><span className="text-gray-500 text-xs">Fecha Entrega Estimada</span><span className="font-medium">{formData.deliveryDate || '-'}</span></div>
              </div>
          </section>


          <section className="mb-8">
              <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
                  2. Materiales y Prendas
              </h3>
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                      <tr>
                          <th className="py-2 px-2 font-semibold">Ítem</th>
                          <th className="py-2 px-2 font-semibold">Variantes</th>
                          <th className="py-2 px-2 text-right font-semibold">Precio U.</th>
                          <th className="py-2 px-2 text-right font-semibold">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {materials.map((m: any, i: number) => {
                          const qty = m.variants?.reduce((acc: number, v: any) => acc + v.quantity, 0) || 0;
                          return (
                              <tr key={i}>
                                  <td className="py-3 px-2 font-medium">{m.name}</td>
                                  <td className="py-3 px-2 text-gray-500 text-xs">
                                      {m.variants?.map((v: any) => `${v.size} (${v.quantity}u)`).join(', ')}
                                  </td>
                                  <td className="py-3 px-2 text-right">$ {m.unitPrice?.toLocaleString()}</td>
                                  <td className="py-3 px-2 text-right font-bold">$ {(qty * m.unitPrice).toLocaleString()}</td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
              {materials.length === 0 && <p className="text-xs text-gray-400 italic mt-2">Sin materiales registrados.</p>}
              <div className="text-right mt-3 pt-2 border-t border-gray-100 font-bold text-gray-700 text-sm">
                  Subtotal Materiales: $ {totalMaterialsCost.toLocaleString()}
              </div>
          </section>


          <section className="mb-8">
              <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
                  3. Costos Adicionales
              </h3>
              <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                      <tr>
                          <th className="py-2 px-2 font-semibold">Concepto</th>
                          <th className="py-2 px-2 font-semibold">Cant.</th>
                          <th className="py-2 px-2 text-right font-semibold">Monto U.</th>
                          <th className="py-2 px-2 text-right font-semibold">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {extras.map((e: any, i: number) => (
                          <tr key={i}>
                              <td className="py-3 px-2 font-medium">{e.name}</td>
                              <td className="py-3 px-2 text-gray-500">{e.quantity}</td>
                              <td className="py-3 px-2 text-right">$ {e.amount?.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right font-bold">$ {(e.quantity * e.amount).toLocaleString()}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              {extras.length === 0 && <p className="text-xs text-gray-400 italic mt-2">Sin costos adicionales.</p>}
              
              {formData.observations && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 font-bold mb-1">Observaciones:</p>
                      <p className="text-sm text-gray-700 italic">{formData.observations}</p>
                  </div>
              )}
          </section>

          {/* Totales Finales */}
          <section className="mt-10 pt-6 border-t-2 border-gray-800 flex flex-col items-end">
              <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal Directo:</span>
                      <span>$ {directCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                      <span>Costos Indirectos:</span>
                      <span>$ {indirectCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                      <span>Ganancia Estimada:</span>
                      <span>$ {profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-[#8B709D] mt-4 pt-4 border-t border-gray-200">
                      <span>TOTAL:</span>
                      <span>$ {grandTotal.toLocaleString()}</span>
                  </div>
              </div>
          </section>
          
          <div className="fixed bottom-8 left-0 w-full text-center text-xs text-gray-400 print:bottom-8">
              Generado automáticamente por KONFEX App
          </div>
      </div>
    </>
  );
}