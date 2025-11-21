"use client";
import NavigationTabs from "./NavigationTabs";

interface PriceSummaryProps {
  total: number;
  indirectCosts: number;
  profit: number;
}

export default function PriceSummaryCard({
  total,
  indirectCosts,
  profit,
}: PriceSummaryProps) {
  

  return (
    <div className="text-center text-white bg-primary-500 px-4 py-6 shadow-md w-full">
      <NavigationTabs
        tabs={[
          { label: "Inbox", href: "/inbox" },
          { label: "Calculadora", href: "/calculator" },
          { label: "Pedidos", href: "/orders" },
        ]}
        className="mb-4" 
      />
      <h3 className="text-lg tracking-wide">Precio total</h3>

      <p className="text-3xl font-bold mt-1">{total}</p>

      <div className="flex justify-center items-center gap-10 mt-4">
        <div className="text-center">
          <p className="text-sm opacity-80">Costos Indirectos</p>
          <p className="text-base font-medium">{indirectCosts}</p>
        </div>

        <div className="w-px h-8 bg-white/40"></div>

        <div className="text-center">
          <p className="text-sm opacity-80">Rentabilidad</p>
          <p className="text-base font-medium">{profit}</p>
        </div>
      </div>
    </div>
  );
}