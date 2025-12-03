export const calcTotalCostoFromDetalles = (detalles: Array<{ cantidad: number; costoUnitario: number }>) => {
    return detalles.reduce((acc, d) => acc + d.cantidad * d.costoUnitario, 0);
  }
  
export const applyGastosYMargen = (
    totalCosto: number, 
    gastosIndirectosPorcentaje: number, 
    margenGananciaPorcentaje: number) => {
        const costosIndirectos = totalCosto * (gastosIndirectosPorcentaje / 100);
        const costoConGastos = totalCosto + costosIndirectos;
        const ganancias = costoConGastos * (margenGananciaPorcentaje / 100);
        return { costosIndirectos, ganancias };
}