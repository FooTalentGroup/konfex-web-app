'use client';

import React, { useState, useEffect } from 'react';
import OrderCard from '@/components/orders/OrderCard';

// --- COMPONENTES REUTILIZABLES ---
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Sidebar from '@/components/common/Sidebar';
import PageHeader from '@/components/common/PageHeader';

// --- HOOKS ---
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

// --- TIPOS ---
export interface Order {
  id: string;
  name: string;
  orderDate: string;
  deliveryDate: string;
  garmentType: string;
  price: number;
  status: 'pagado' | 'deposito';
  telegramChatId?: string; // ChatId de Telegram para enviar mensajes
}

// --- DATOS MOCK ---
const MOCK_API_RESPONSE: Order[] = [
  {
    id: '1254307',
    name: 'Ana Julieta',
    orderDate: '00/00/00',
    deliveryDate: '00/00/00',
    garmentType: 'Blusa manga larga',
    price: 0,
    status: 'pagado',
    telegramChatId: '1585032016', // Ejemplo de chatId de Telegram
  },
  {
    id: '1234569',
    name: 'Ana Julieta',
    orderDate: '00/00/00',
    deliveryDate: '00/00/00',
    garmentType: 'Blusa manga larga',
    price: 0,
    status: 'pagado',
    telegramChatId: '1585032016', // Ejemplo de chatId de Telegram
  }
];

export default function PedidosPage() {
  const { user, mounted } = useAuth();
  const { isOpen, open, close } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos
    const timer = setTimeout(() => {
      setOrders(MOCK_API_RESPONSE);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(order => 
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
                  style={{ fontFamily: 'var(--font-lato), sans-serif' }}
                >
                  Cargando pedidos...
                </p>
              </div>
            )}
            {!isLoading && (
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
                      style={{ fontFamily: 'var(--font-lato), sans-serif' }}
                    >
                      No se encontraron pedidos con ese nombre.
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