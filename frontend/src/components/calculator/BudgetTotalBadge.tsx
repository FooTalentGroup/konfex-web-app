import React from "react";
import Image from "next/image";

interface BudgetTotalBadgeProps {
  amount: number;
  className?: string;
  iconSize?: number;
}

export default function BudgetTotalBadge({
  amount,
  className = "",
  iconSize = 18,
}: BudgetTotalBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 bg-[#F4E7FD] px-3 py-1.5 rounded-lg border border-[#F4E7FD] text-[#8B709D] ${className}`}
    >
      <Image
        src="/presupuestoPrecio.png"
        alt="Precio"
        width={iconSize}
        height={iconSize}
        className="object-contain"
      />
      <span className="font-bold text-lg font-lato text-current">
        {amount.toLocaleString("es-AR")}
      </span>
    </div>
  );
}

