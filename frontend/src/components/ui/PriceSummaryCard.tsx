"use client";
import NavigationTabs from "./NavigationTabs";
import MoreOptionsButton from "./MoreOptionsBtn";

interface PriceSummaryProps {
  total: number;
  costs: number;
  profit: number;
  onSend: () => void;
  onSavePDF: () => void;
}

export default function PriceSummaryCard({
  total,
  costs,
  profit,
  onSend,
  onSavePDF,
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
      <div className="flex flex-col relative">
        <h3 className="text-lg tracking-wide">Precio total</h3>

        <p className="text-3xl font-bold mt-1">$ {total}</p>
        <MoreOptionsButton onSend={onSend} onSavePDF={onSavePDF} />
      </div>


      <div className="flex justify-center items-center gap-10 mt-4">
        <div className="text-center">
          <p className="text-sm opacity-80">Costos</p>
          <p className="text-base font-medium">$ {costs}</p>
        </div>

        <div className="w-px h-8 bg-white/40"></div>

        <div className="text-center">
          <p className="text-sm opacity-80">Rentabilidad</p>
          <p className="text-base font-medium">$ {profit}</p>
        </div>
      </div>
    </div>
  );
}
