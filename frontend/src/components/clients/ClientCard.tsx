import React from "react";
import { FileText, Send, Check, User } from "lucide-react";

interface ClientCardProps {
  name: string;
  source?: "telegram" | "manual";
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onBudgetClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTelegramClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ClientCard({
  name,
  source = "telegram",
  isSelectionMode = false,
  isSelected = false,
  onClick,
  onBudgetClick,
  onTelegramClick,
}: ClientCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
      relative bg-white px-3 py-4 rounded-3xl shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer
      ${isSelected ? "bg-[#F5F3F8]" : "hover:scale-[1.01] active:scale-[0.99]"}
    `}
    >
      <div
        className={`
        transition-all duration-300 overflow-hidden flex-shrink-0
        ${isSelectionMode ? "w-6 opacity-100" : "w-0 opacity-0"}
      `}
      >
        <div
          className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${
            isSelected
              ? "bg-[#8B709D] border-[#8B709D]"
              : "border-[#D5CCDE] bg-white"
          }
        `}
        >
          {isSelected && <Check size={14} className="text-white stroke-[3]" />}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex justify-between items-center gap-2 w-full">
          <h3
            className={`font-lato font-bold text-[18px] leading-tight transition-colors truncate ${
              isSelected ? "text-[#8B709D]" : "text-gray-900"
            }`}
          >
            {name}
          </h3>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onBudgetClick) onBudgetClick(e);
            }}
            disabled={isSelectionMode}
            className={`flex items-center gap-1.5 bg-[#F2D699] text-black px-3 py-1 rounded-full text-[12px] font-lato font-bold shadow-sm transition-all whitespace-nowrap flex-shrink-0
              ${
                isSelectionMode
                  ? "opacity-0 pointer-events-none"
                  : "hover:bg-[#E5C884]"
              }
            `}
          >
            <FileText size={12} className="stroke-[2.5]" />
            <span>Presupuesto</span>
          </button>
        </div>

        <div className="flex items-center">
          {source === "manual" ? (
            <div className="flex items-center gap-1.5 bg-[#F3F0F5] text-[#8B709D] px-3 py-1 rounded-full text-[12px] font-lato font-bold w-fit">
              <User size={12} className="stroke-[2.5]" />
              <span>Manual</span>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onTelegramClick) onTelegramClick(e);
              }}
              disabled={isSelectionMode}
              className={`flex items-center gap-1.5 bg-[#D1EEF3] text-[#2A8FA1] px-3 py-1 rounded-full text-[12px] font-lato font-bold transition-all w-fit
                   ${
                     isSelectionMode
                       ? "opacity-0 pointer-events-none"
                       : "hover:bg-[#BEE5EC]"
                   }
                `}
            >
              <Send size={12} className="stroke-[2.5]" />
              <span>Telegram</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
