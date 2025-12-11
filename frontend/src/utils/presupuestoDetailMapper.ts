import { PresupuestoResponseDto } from "@/types/presupuesto.types";
import { BudgetDetailData } from "@/components/presupuestos/BudgetDetailCard";
import { BudgetItem } from "@/components/presupuestos/BudgetItemsTable";

/**
 * Calcula los días de validez del presupuesto
 */
const calcularValidezDias = (
  fechaCreacion: string,
  fechaVencimiento: string | null
): number => {
  if (!fechaVencimiento) return 0;

  const creacion = new Date(fechaCreacion);
  const vencimiento = new Date(fechaVencimiento);
  const diferencia = vencimiento.getTime() - creacion.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Formatea el número de presupuesto
 */
export const formatNumeroPresupuesto = (numero: number): string => {
  return numero.toString().padStart(6, "0");
};

/**
 * Mapea un PresupuestoResponseDto a BudgetDetailData
 */
export const mapPresupuestoToBudgetDetail = (
  presupuesto: PresupuestoResponseDto
): BudgetDetailData => {
  const validezDias = calcularValidezDias(
    presupuesto.fechaCreacion,
    presupuesto.fechaVencimiento
  );

  return {
    id: formatNumeroPresupuesto(presupuesto.numeroPresupuesto),
    estado: presupuesto.estado,
    fechaCreacion: presupuesto.fechaCreacion,
    titulo: presupuesto.nombre || "Sin título",
    clienteNombre: presupuesto.cliente?.nombre || "Sin cliente",
    telefono: presupuesto.cliente?.telefono || "Sin teléfono",
    email: presupuesto.cliente?.email || "Sin email",
    fechaFinalizacion:
      presupuesto.fechaVencimiento || presupuesto.fechaCreacion,
    validezDias,
  };
};

/**
 * Mapea los detalles y adicionales de un presupuesto a BudgetItem[]
 */
export const mapPresupuestoToBudgetItems = (
  presupuesto: PresupuestoResponseDto
): BudgetItem[] => {
  const items: BudgetItem[] = [];

  presupuesto.detalles.forEach((detalle) => {
    items.push({
      nombre: detalle.descripcion || `Producto #${detalle.productoId}`,
      talla: "-",
      unidades: detalle.cantidad,
      precioUnitario: detalle.costoUnitario,
      total: detalle.cantidad * detalle.costoUnitario,
    });
  });

  if (presupuesto.adicionales) {
    presupuesto.adicionales.forEach((adicional) => {
      items.push({
        nombre: adicional.nombre,
        talla: "-",
        unidades: adicional.cantidad,
        precioUnitario: adicional.monto,
        total: adicional.totalCosto,
      });
    });
  }

  return items;
};

/**
 * Calcula el porcentaje de IVA desde el presupuesto
 */
export const calcularIVAPorcentaje = (
  presupuesto: PresupuestoResponseDto
): number => {
  const baseImponible =
    presupuesto.totalCosto +
    presupuesto.costosIndirectos +
    presupuesto.ganancias;

  if (baseImponible === 0) return 0;

  const ivaPorcentaje = (presupuesto.iva / baseImponible) * 100;
  return Math.round(ivaPorcentaje * 100) / 100;
};
