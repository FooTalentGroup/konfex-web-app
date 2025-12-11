"use client";
import { Plus, Trash2, XCircleIcon } from "lucide-react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface BtnActionsCollectionProps {
  collectionsToDelete?: Set<number>;
  isDeleteMode: boolean;
  toggleDeleteMode: () => void;
  confirmDeletion: () => void;
  onAddCollection?: () => void;
  isTelegramBudget?: boolean;
}

const BtnActionsCollectionDefault = ({
  isDeleteMode,
  toggleDeleteMode,
  onAddCollection,
}: BtnActionsCollectionProps) => {
  return (
    <div className="fixed bg-primary-200 px-4 py-2 bottom-20 right-1/2 transform translate-x-1/2 flex gap-3 rounded-full z-10">
      <button
        type="button"
        onClick={onAddCollection}
        className="px-4 py-2 bg-primary-500 hover:bg-secondary-600 rounded-full text-white shadow-lg transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
      </button>
      {!isDeleteMode ? (
        <button
          onClick={toggleDeleteMode}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
          title="Modo eliminar"
        >
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      ) : (
        <button
          onClick={toggleDeleteMode}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-full text-white shadow-lg transition-colors font-medium text-sm"
        >
          <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};

const BtnActionsCollectionFichaMode = ({
  toggleDeleteMode,
  onAddCollection,
  isTelegramBudget = false,
  confirmDeletion,
}: BtnActionsCollectionProps) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
      <div className="flex items-center gap-3 bg-[#D4C4DD] px-3 py-2 rounded-full shadow-lg">
        <button
          type="button"
          onClick={onAddCollection}
          className="w-14 h-14 bg-[#9D86AC] hover:bg-[#8B7499] rounded-full flex items-center justify-center text-white shadow-md transition-all"
          title={isTelegramBudget ? "Abrir en Telegram" : "Descargar PDF"}
        >
          {isTelegramBudget ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
          ) : (
            <ArrowDownTrayIcon className="w-6 h-6" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleDeleteMode}
          className="w-14 h-14 bg-[#9D86AC] hover:bg-[#8B7499] rounded-full flex items-center justify-center text-white shadow-md transition-all"
          title="Editar presupuesto"
        >
          <PencilSquareIcon className="w-6 h-6" />
        </button>
      </div>

      <button
        type="button"
        onClick={confirmDeletion}
        className="px-8 py-4 bg-[#B65CF2] hover:bg-[#9D4EDD] rounded-full text-white shadow-lg transition-all font-[var(--font-lato),sans-serif] font-medium text-base flex items-center gap-3"
        title="Convertir presupuesto en pedido"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Pasar a pedidos</span>
      </button>
    </div>
  );
};

const BtnActionsCollections = {
  default: BtnActionsCollectionDefault,
  fichaMode: BtnActionsCollectionFichaMode,
};

export default BtnActionsCollections;
