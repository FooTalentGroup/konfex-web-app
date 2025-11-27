'use client';

import React, { useState, useEffect } from 'react';
import OrderCard from '@/components/orders/OrderCard';

// --- COMPONENTES REUTILIZABLES ---
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import SearchBar from '@/components/common/SearchBar'; 
import NavigationTabs from '@/components/ui/NavigationTabs';

// --- HOOKS ---
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
}

// --- DATOS MOCK ---
const MOCK_API_RESPONSE: Order[] = [
  {
    id: '1234569',
    name: 'Ana Julieta',
    orderDate: '00/00/00',
    deliveryDate: '00/00/00',
    garmentType: 'Blusa manga larga',
    price: 0,
    status: 'pagado',
  },
  {
    id: '1234570',
    name: 'Maria Elena',
    orderDate: '12/11/24',
    deliveryDate: '20/11/24',
    garmentType: 'Vestido Fiesta',
    price: 45000,
    status: 'pagado',
  },
  {
    id: '1234571',
    name: 'Sofia Lozano',
    orderDate: '15/11/24',
    deliveryDate: '30/11/24',
    garmentType: 'Pantalón Lino',
    price: 28000,
    status: 'deposito',
  }
];

export default function PedidosPage() {
  const { isOpen, open, close } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#F3F0F5] font-lato">
      
      <Sidebar isOpen={isOpen} onClose={close} />


      <div className="bg-[#8B709D] pb-8 rounded-b-[30px] shadow-md relative z-0">
        
        {/* Header Full Width */}
        <div className="pt-2 w-full">
            <Header onMenuClick={open} />
        </div>

      
        <div className="max-w-4xl mx-auto w-full">
            <div className="px-5 mt-2 mb-4">
              <NavigationTabs />
            </div>

            <div className="px-5">
              <SearchBar 
                placeholder="Buscar pedido por nombre"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e?.target?.value ?? e)}
             
                className="w-full bg-white rounded-full border-none shadow-sm"
              />
            </div>
        </div>
      </div>

     
      <main className="px-5 pt-6 pb-20 max-w-4xl mx-auto w-full">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 bg-white/50 rounded-xl backdrop-blur-sm mx-auto max-w-sm mt-10 shadow-sm">
            Cargando pedidos...
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="h-full">
                 <OrderCard {...order} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white/50 rounded-xl backdrop-blur-sm mx-auto max-w-sm mt-10 shadow-sm">
            No se encontraron pedidos con ese nombre.
          </div>
        )}
        
        <div className="h-10"></div>
      </main>
    </div>
  );
}