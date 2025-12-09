import React from 'react';
import { FileText, Send, Check, User } from 'lucide-react';

interface ClientCardProps {
  name: string;
  source?: 'telegram' | 'manual'; 
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onBudgetClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTelegramClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ClientCard({ 
  name, 
  source = 'telegram',
  isSelectionMode = false,
  isSelected = false,
  onClick,
  onBudgetClick, 
  onTelegramClick 
}: ClientCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
      relative bg-white p-5 rounded-3xl shadow-sm border transition-all duration-300 flex items-center gap-4 cursor-pointer
      ${isSelected ? 'border-[#C071F4] bg-purple-50' : 'border-gray-50 hover:scale-[1.01] active:scale-[0.99]'}
    `}>
      

      <div className={`
        transition-all duration-300 overflow-hidden flex-shrink-0
        ${isSelectionMode ? 'w-6 opacity-100' : 'w-0 opacity-0'}
      `}>
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected ? 'bg-[#C071F4] border-[#C071F4]' : 'border-gray-300 bg-white'}
        `}>
          {isSelected && <Check size={14} className="text-white stroke-[3]" />}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">

        <div className="flex justify-between items-start">
          <h3 className={`font-bold text-lg leading-tight transition-colors ${isSelected ? 'text-[#8B709D]' : 'text-gray-800'}`}>
            {name}
          </h3>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onBudgetClick) onBudgetClick(e);
            }}
            disabled={isSelectionMode}
            className={`flex items-center gap-1.5 bg-[#F2BB5C] text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-all whitespace-nowrap
              ${isSelectionMode ? 'opacity-0 pointer-events-none' : 'hover:bg-[#d9a54a]'}
            `}
          >
            <FileText size={12} className="stroke-[3]" />
            <span>Presupuesto</span>
          </button>
        </div>


        <div className="-mt-1">
          {source === 'manual' ? (
             <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-[10px] font-bold w-fit border border-gray-200">
                <User size={12} className="stroke-[3]" />
                <span>Manual</span>
             </div>
          ) : (

             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTelegramClick) onTelegramClick(e);
                }}
                disabled={isSelectionMode}
                className={`flex items-center gap-1.5 bg-[#D1EEF3] text-[#2A8FA1] px-3 py-1.5 rounded-full text-[10px] font-bold transition-all w-fit
                   ${isSelectionMode ? 'opacity-0 pointer-events-none' : 'hover:bg-[#bde4ea]'}
                `}
              >
                <Send size={12} className="stroke-[3]" />
                <span>Telegram</span>
              </button>
          )}
        </div>
      </div>
    </div>
  );
}