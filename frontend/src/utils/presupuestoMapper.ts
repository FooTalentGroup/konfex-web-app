import { CreatePresupuestoDto } from '@/services/presupuesto.service';

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

interface BudgetFormDataWithShipping extends BudgetFormData {
  shippingFee?: number;
}

interface BudgetFormData {
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  deliveryDate: string;
  desiredProfit: number;
  materials: Material[];
  extras: Extra[];
  observations?: string;
  gastosNegocioId?: number;
  clienteId?: number;
  shippingFee?: number;
}

interface GastosNegocio {
  id: number;
  porcentaje: number;
}

/**
 * Convierte una fecha en formato DD/MM/YYYY o similar a ISO datetime string
 */
function convertDateToISO(dateString: string): string | undefined {
  if (!dateString || dateString.trim() === '') {
    return undefined;
  }

  // Si ya está en formato ISO, retornarlo
  if (dateString.includes('T') || dateString.includes('Z')) {
    return dateString;
  }

  // Intentar parsear diferentes formatos
  let date: Date;
  
  // Formato DD/MM/YYYY
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      return undefined;
    }
  } else {
    // Intentar parseo directo
    date = new Date(dateString);
  }

  // Validar que la fecha sea válida
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

/**
 * Calcula el total de costo desde los detalles y adicionales
 */
function calculateTotalCosto(
  detalles: Array<{ cantidad: number; costoUnitario: number }>,
  adicionales: Array<{ cantidad: number; monto: number }>
): number {
  const totalDetalles = detalles.reduce(
    (sum, detalle) => sum + detalle.cantidad * detalle.costoUnitario,
    0
  );

  const totalAdicionales = adicionales.reduce(
    (sum, adicional) => sum + adicional.cantidad * adicional.monto,
    0
  );

  return totalDetalles + totalAdicionales;
}

/**
 * Calcula costos indirectos basado en el porcentaje de gastos de negocio
 */
function calculateCostosIndirectos(
  totalCosto: number,
  gastosNegocio: GastosNegocio
): number {
  return (totalCosto * gastosNegocio.porcentaje) / 100;
}

/**
 * Calcula ganancias basado en el margen de ganancia porcentual
 */
function calculateGanancias(
  totalCosto: number,
  margenGananciaPorcentaje: number
): number {
  return (totalCosto * margenGananciaPorcentaje) / 100;
}

/**
 * Mapea los datos del formulario del frontend al formato esperado por el backend
 */
export function mapFormDataToBackend(
  formData: BudgetFormData,
  gastosNegocio: GastosNegocio
): CreatePresupuestoDto {
  // Validar que tenga gastosNegocioId
  if (!formData.gastosNegocioId && !gastosNegocio) {
    throw new Error('gastosNegocioId es requerido');
  }

  const gastosNegocioId = formData.gastosNegocioId || gastosNegocio.id;

  // Mapear materiales a detalles (un detalle por cada variant)
  const detalles = formData.materials.flatMap((material) => {
    // Validar que tenga productoId
    if (!material.productoId) {
      throw new Error(`El material "${material.name}" no tiene productoId asociado`);
    }

    return material.variants.map((variant) => ({
      productoId: material.productoId!,
      descripcion: `${material.name} - Talla ${variant.size}`,
      cantidad: variant.quantity,
      costoUnitario: material.unitPrice,
    }));
  });

  // Mapear extras a adicionales
  // Si hay shippingFee, agregarlo al primer adicional o crear uno especial
  const shippingFeeValue = formData.shippingFee || 0;
  const adicionales = formData.extras.map((extra, index) => ({
    nombre: extra.name,
    cantidad: extra.quantity,
    monto: extra.amount,
    totalCosto: extra.quantity * extra.amount,
    // Agregar tarifaEnvio solo al primer adicional si hay shippingFee
    tarifaEnvio: index === 0 && shippingFeeValue > 0 ? shippingFeeValue : undefined,
    observaciones: formData.observations || undefined,
  }));

  // Si hay shippingFee pero no hay extras, crear un adicional especial para la tarifa de envío
  if (shippingFeeValue > 0 && formData.extras.length === 0) {
    adicionales.push({
      nombre: "Tarifa de envío",
      cantidad: 1,
      monto: shippingFeeValue,
      totalCosto: shippingFeeValue,
      tarifaEnvio: shippingFeeValue,
      observaciones: formData.observations || undefined,
    });
  }

  // Calcular totales
  const totalCosto = calculateTotalCosto(detalles, adicionales);
  const costosIndirectos = calculateCostosIndirectos(totalCosto, gastosNegocio);
  const ganancias = calculateGanancias(totalCosto, formData.desiredProfit);

  return {
    nombre: formData.title || undefined,
    clienteId: formData.clienteId || null,
    fechaVencimiento: convertDateToISO(formData.deliveryDate),
    estado: "BORRADOR",
    margenGananciaPorcentaje: formData.desiredProfit,
    gastosNegocioId,
    totalCosto,
    costosIndirectos,
    ganancias,
    notas: formData.observations || undefined,
    detalles: detalles.length > 0 ? detalles : undefined,
    adicionales: adicionales.length > 0 ? adicionales : undefined,
  };
}

