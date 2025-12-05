"use client";

import { useState, useEffect } from "react";
import OrderCard from "@/components/orders/OrderCard";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { pedidoService, type Pedido } from "@/services/pedido.service";
import { formatDateShort } from "@/utils/dateUtils";

export interface Order {
  id: string;
  name: string;
  orderDate: string;
  deliveryDate: string;
  garmentType: string;
  price: number;
  status: "pagado" | "deposito";
  operativoStatus?: "presupuesto" | "en compra" | "en produccion" | "entregado";
  telegramChatId?: string;
}

// Función para mapear el estado del backend al estado operativo del frontend
const mapEstadoToOperativoStatus = (
  estado: Pedido["estado"]
): "presupuesto" | "en compra" | "en produccion" | "entregado" => {
  switch (estado) {
    case "PENDIENTE":
      return "presupuesto";
    case "EN_PRODUCCION":
      return "en produccion";
    case "LISTO":
      return "en compra";
    case "ENTREGADO":
      return "entregado";
    case "CANCELADO":
      return "presupuesto";
    default:
      return "presupuesto";
  }
};

// Función para mapear Pedido del backend a Order del frontend
const mapPedidoToOrder = (pedido: Pedido): Order => {
  const garmentType =
    pedido.detalles.length > 0
      ? pedido.detalles[0].producto.nombre
      : pedido.presupuesto.nombre || "Sin especificar";

  return {
    id: pedido.id.toString(),
    name: pedido.cliente.nombre,
    orderDate: formatDateShort(pedido.fechaCreacion),
    deliveryDate: formatDateShort(pedido.fechaEntregaEstimada),
    garmentType,
    price: pedido.presupuesto.totalFinal,
    status: pedido.pagado ? "pagado" : "deposito",
    operativoStatus: mapEstadoToOperativoStatus(pedido.estado),
    telegramChatId: pedido.telegramChatId || undefined,
  };
};

export default function PedidosPage() {
  const { user, mounted } = useAuth();
  const { isOpen, open, close } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const pedidos = await pedidoService.getAll();
        const mappedOrders = pedidos.map(mapPedidoToOrder);
        setOrders(mappedOrders);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar los pedidos. Por favor, intenta nuevamente.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm)
  );

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#9D86AC]">
      <Header onMenuClick={open} />
      <Sidebar isOpen={isOpen} onClose={close} />

      <div className="flex-1 flex flex-col">
        <PageHeader
          title="Pedidos"
          description="Consulta y edita a todos tus pedidos desde aquí."
          searchPlaceholder="Buscar pedido por nombre"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          backgroundColor="#9D86AC"
        />

        <main className="flex-1 rounded-t-3xl px-4 sm:px-6 pb-4 sm:pb-6 md:pb-8 bg-white">
          <div className="w-full max-w-lg mx-auto pt-4 sm:pt-6">
            {isLoading && (
              <div className="text-center py-12">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  Cargando pedidos...
                </p>
              </div>
            )}
            {!isLoading && error && (
              <div className="text-center py-12">
                <p
                  className="text-red-500 text-sm"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}
            {!isLoading && !error && (
              <>
                {filteredOrders.length > 0 ? (
                  <div className="space-y-0">
                    {filteredOrders.map((order, index) => (
                      <OrderCard key={`${order.id}-${index}`} {...order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "var(--font-lato), sans-serif" }}
                    >
                      {searchTerm
                        ? "No se encontraron pedidos con ese nombre."
                        : "No hay pedidos disponibles."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
