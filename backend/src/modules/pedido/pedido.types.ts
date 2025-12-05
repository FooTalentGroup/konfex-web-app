export interface PedidoCreateInput {
  presupuestoId: number;
  clienteId: number;
  fechaEntregaEstimada?: Date | null;
}

export interface PedidoUpdateInput {
  estado?: "NO_VISTO" | "EN_COMPRA" | "EN_PRODUCCION" | "ENTREGADO";
  pagado?: boolean;
  fechaEntregaEstimada?: Date | null;
  fechaEntregaReal?: Date | null;
}

