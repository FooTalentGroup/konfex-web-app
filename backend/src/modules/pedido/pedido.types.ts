export interface PedidoCreateInput {
  presupuestoId: number;
  clienteId: number;
  fechaEntregaEstimada?: Date | null;
}

export interface PedidoUpdateInput {
  estado?: "PENDIENTE" | "EN_PRODUCCION" | "LISTO" | "ENTREGADO" | "CANCELADO";
  pagado?: boolean;
  fechaEntregaEstimada?: Date | null;
  fechaEntregaReal?: Date | null;
}

