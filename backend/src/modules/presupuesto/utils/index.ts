export const calcTotalCostoFromDetalles = (
  detalles: Array<{ cantidad: number; costoUnitario: number }>
) => {
  return detalles.reduce((acc, d) => acc + d.cantidad * d.costoUnitario, 0);
};

export const applyGastosYMargen = (
  totalCosto: number,
  gastosIndirectosPorcentaje: number,
  margenGananciaPorcentaje: number
) => {
  const costoConGastos = totalCosto * (1 + gastosIndirectosPorcentaje / 100);
  const totalVenta = costoConGastos * (1 + margenGananciaPorcentaje / 100);
  return { costoConGastos, totalVenta };
};
