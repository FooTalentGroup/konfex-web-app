import { BudgetResponseDto } from "@/types/budget.types";
import { formatDateShort } from "./dateUtils";

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
 * @param presupuesto - El presupuesto del backend
 * @param gastosNegocioList - Lista de gastos de negocio para buscar el ID por porcentaje (opcional)
 */
export function loadBudgetToForm(
  presupuesto: BudgetResponseDto,
  gastosNegocioList?: Array<{ id: number; porcentaje: number }>
): BudgetFormData {
  const materialesMap = new Map<
    number,
    {
      productoId: number;
      name: string;
      unitPrice: number;
      variants: Array<{ size: string; quantity: number }>;
    }
  >();

  presupuesto.detalles?.forEach((detalle) => {
    const productoId = detalle.productoId;

    if (!materialesMap.has(productoId)) {
      // Formato esperado: "Nombre - Talla X"
      const descripcion = detalle.descripcion || "";
      const match = descripcion.match(/^(.+?)\s*-\s*Talla\s+(.+)$/);
      const name = match
        ? match[1].trim()
        : descripcion || `Producto ${productoId}`;

      materialesMap.set(productoId, {
        productoId,
        name,
        unitPrice: detalle.costoUnitario,
        variants: [],
      });
    }

    const material = materialesMap.get(productoId)!;

    const descripcion = detalle.descripcion || "";
    const match = descripcion.match(/Talla\s+(\w+)/);
    const size = match ? match[1] : "M";

    material.variants.push({
      size,
      quantity: detalle.cantidad,
    });
  });

  const extras: Extra[] = [];
  let shippingFee = 0;

  presupuesto.adicionales?.forEach((adicional) => {
    if (adicional.tarifaEnvio && adicional.tarifaEnvio > 0) {
      shippingFee = adicional.tarifaEnvio;
    }

    if (
      adicional.nombre.toLowerCase() !== "tarifa de envío" ||
      adicional.cantidad > 1 ||
      adicional.monto !== adicional.tarifaEnvio
    ) {
      extras.push({
        name: adicional.nombre,
        quantity: adicional.cantidad,
        amount: adicional.monto,
      });
    }
  });

  return {
    title: "",
    clientName: presupuesto.cliente?.nombre || "",
    clientEmail: presupuesto.cliente?.email || undefined,
    clientPhone: undefined,
    deliveryDate: formatDateShort(presupuesto.fechaVencimiento),
    desiredProfit: presupuesto.margenGananciaPorcentaje,
    gastosNegocioId: gastosNegocioList
      ? gastosNegocioList.find(
          (g) =>
            Math.abs(g.porcentaje - presupuesto.gastosIndirectosPorcentaje) <
            0.01
        )?.id
      : undefined,
    clienteId: presupuesto.clienteId || undefined,
    materials: Array.from(materialesMap.values()),
    extras,
    observations: presupuesto.notas || undefined,
    shippingFee,
  };
}
