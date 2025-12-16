import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
    onClick: () => void;
    isActive?: boolean;
}

export default function DeleteButton({ onClick, isActive = false }: DeleteButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center justify-center
        w-10 h-10 sm:w-12 sm:h-12
        rounded-full
        transition-all duration-200
        shadow-lg
        ${isActive
                    ? 'bg-[var(--terciary-color-500)] text-[var(--purple-dark)]'
                    : 'bg-[var(--primary-color-500)] hover:bg-gray-700'
                }
      `}
            aria-label="Eliminar categorías"
        >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-white " />
        </button>
    );
}
