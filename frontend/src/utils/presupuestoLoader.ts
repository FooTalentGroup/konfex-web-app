import { PresupuestoResponseDto } from '@/types/presupuesto.types';

interface Material {
  productoId?: number;
  name: string;
  unitPrice: number;
  variants: Array<{ size: string; quantity: number }>;
}

interface Extra {
  name: string;
  quantity: number;
  amount: number;
}

interface BudgetFormData {
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  deliveryDate: string;
  desiredProfit: number;
  gastosNegocioId?: number;
  clienteId?: number;
  materials: Material[];
  extras: Extra[];
  observations?: string;
  shippingFee?: number;
}

/**
 * Carga los datos de un presupuesto del backend al formato del formulario del frontend
 */
export function loadPresupuestoToForm(
  presupuesto: PresupuestoResponseDto
): BudgetFormData {
  // Convertir fecha de ISO a formato DD/MM/YYYY
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Agrupar detalles por producto para crear materiales con variants
  const materialesMap = new Map<number, {
    productoId: number;
    name: string;
    unitPrice: number;
    variants: Array<{ size: string; quantity: number }>;
  }>();

  presupuesto.detalles?.forEach((detalle) => {
    const productoId = detalle.productoId;
    
    if (!materialesMap.has(productoId)) {
      // Extraer nombre base del producto desde la descripción
      // Formato esperado: "Nombre - Talla X"
      const descripcion = detalle.descripcion || '';
      const match = descripcion.match(/^(.+?)\s*-\s*Talla\s+(.+)$/);
      const name = match ? match[1].trim() : descripcion || `Producto ${productoId}`;
      
      materialesMap.set(productoId, {
        productoId,
        name,
        unitPrice: detalle.costoUnitario,
        variants: [],
      });
    }

    const material = materialesMap.get(productoId)!;
    
    // Extraer talla de la descripción
    const descripcion = detalle.descripcion || '';
    const match = descripcion.match(/Talla\s+(\w+)/);
    const size = match ? match[1] : 'M'; // Default a M si no se encuentra
    
    material.variants.push({
      size,
      quantity: detalle.cantidad,
    });
  });

  // Convertir adicionales a extras
  const extras: Extra[] = [];
  let shippingFee = 0;

  presupuesto.adicionales?.forEach((adicional) => {
    // Si tiene tarifaEnvio, guardarla por separado
    if (adicional.tarifaEnvio && adicional.tarifaEnvio > 0) {
      shippingFee = adicional.tarifaEnvio;
    }

    // Agregar como extra (excluyendo el que es solo tarifa de envío)
    if (adicional.nombre.toLowerCase() !== 'tarifa de envío' || adicional.cantidad > 1 || adicional.monto !== adicional.tarifaEnvio) {
      extras.push({
        name: adicional.nombre,
        quantity: adicional.cantidad,
        amount: adicional.monto,
      });
    }
  });

  return {
    title: presupuesto.nombre || '',
    clientName: presupuesto.cliente?.nombre || '',
    clientEmail: presupuesto.cliente?.email || undefined,
    clientPhone: undefined, // No está disponible en el response
    deliveryDate: formatDate(presupuesto.fechaVencimiento),
    desiredProfit: presupuesto.margenGananciaPorcentaje,
    gastosNegocioId: undefined, // Necesitaríamos el ID, pero solo tenemos el porcentaje
    clienteId: presupuesto.clienteId || undefined,
    materials: Array.from(materialesMap.values()),
    extras,
    observations: presupuesto.notas || undefined,
    shippingFee,
  };
}

