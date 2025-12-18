import { CreateBudgetDto } from "@/services/budget.service";

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
  if (!dateString || dateString.trim() === "") {
    return undefined;
  }

  if (dateString.includes("T") || dateString.includes("Z")) {
    return dateString;
  }

  let date: Date;

  if (dateString.includes("/")) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      return undefined;
    }
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

/**
 * Calcula el total de costo desde los detalles y adicionales.
 */
function calculateTotalCost(
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
 * Calcula costos indirectos basado en la suma de TODOS los porcentajes de gastos de negocio
 */
function calculateIndirectCosts(
  totalCosto: number,
  todosGastosNegocio: GastosNegocio[]
): number {
  const porcentajeTotal = todosGastosNegocio.reduce(
    (sum, gasto) => sum + gasto.porcentaje,
    0
  );
  return (totalCosto * porcentajeTotal) / 100;
}

/**
 * Calcula ganancias basado en el margen de ganancia porcentual
 */
function calculateProfits(
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
  todosGastosNegocio: GastosNegocio[],
  origen: "telegram" | "manual" = "manual"
): CreateBudgetDto {
  if (!todosGastosNegocio || todosGastosNegocio.length === 0) {
    throw new Error("No hay gastos de negocio configurados");
  }

  // Usar el primer gasto de negocio como ID para mantener la relación en BD
  // Pero el cálculo se hace con TODOS los gastos
  const gastosNegocioId = formData.gastosNegocioId || todosGastosNegocio[0].id;

  const detalles = formData.materials.flatMap((material) => {
    if (!material.productoId) {
      throw new Error(
        `El material "${material.name}" no tiene productoId asociado`
      );
    }

    return material.variants.map((variant) => ({
      productoId: material.productoId!,
      descripcion: `${material.name} - Talla ${variant.size}`,
      cantidad: variant.quantity,
      costoUnitario: material.unitPrice,
    }));
  });

  // Mapear extras a adicionales
  const shippingFeeValue = formData.shippingFee || 0;
  const adicionales = formData.extras.map((extra, index) => ({
    nombre: extra.name,
    cantidad: extra.quantity,
    monto: extra.amount,
    totalCosto: extra.quantity * extra.amount,
    tarifaEnvio:
      index === 0 && shippingFeeValue > 0 ? shippingFeeValue : undefined,
    observaciones: formData.observations || undefined,
  }));

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
  const totalCosto = calculateTotalCost(detalles, adicionales);
  const costosIndirectos = calculateIndirectCosts(
    totalCosto,
    todosGastosNegocio
  );
  const ganancias = calculateProfits(totalCosto, formData.desiredProfit);

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
    origen,
    detalles: detalles.length > 0 ? detalles : undefined,
    adicionales: adicionales.length > 0 ? adicionales : undefined,
  };
}
