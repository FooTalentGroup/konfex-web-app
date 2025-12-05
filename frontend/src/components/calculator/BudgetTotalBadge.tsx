import React from "react";
import { CircleDollarSign } from "lucide-react";

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
      className={`flex items-center gap-2 bg-[#F4E7FD] px-3 py-1.5 rounded-lg border border-[#F4E7FD] ${className}`}
    >
      <CircleDollarSign
        size={iconSize}
        className="text-[#8B709D]"
        strokeWidth={2.5}
      />
      <span className="font-bold text-[#8B709D] text-lg font-lato">
        $ {amount.toLocaleString("es-AR")}
      </span>
    </div>
  );
}

