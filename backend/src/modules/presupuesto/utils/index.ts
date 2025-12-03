export const calcTotalCostoFromDetalles = (
  detalles: Array<{ cantidad: number; costoUnitario: number }>,
) => {
  return detalles.reduce((acc, d) => acc + d.cantidad * d.costoUnitario, 0);
};

export const applyGastosYMargen = (
  totalCosto: number,
  gastosIndirectosPorcentaje: number,
  margenGananciaPorcentaje: number,
) => {
  const costosIndirectos = totalCosto * (gastosIndirectosPorcentaje / 100);
  const costoConGastos = totalCosto + costosIndirectos;
  const ganancias = costoConGastos * (margenGananciaPorcentaje / 100);
  return { costosIndirectos, ganancias };
};

/**
 * Calcula el IVA y el total final aplicando el impuesto general
 * @param subtotal - Subtotal antes del IVA (totalCosto + costosIndirectos + ganancias)
 * @param ivaPorcentaje - Porcentaje del IVA (ej: 19 para 19%)
 * @returns Objeto con iva y totalFinal
 */
export const applyIVA = (subtotal: number, ivaPorcentaje: number) => {
  const iva = subtotal * (ivaPorcentaje / 100);
  const totalFinal = subtotal + iva;
  return { iva, totalFinal };
};
