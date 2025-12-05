"use client"
import { Plus, Trash2 } from "lucide-react";

interface BtnActionsCollectionProps {
  collectionsToDelete: Set<number>;
  isDeleteMode: boolean;
  toggleDeleteMode: () => void;
  confirmDeletion: () => void;
}

export default function BtnActionsCollections({ collectionsToDelete, isDeleteMode, toggleDeleteMode, confirmDeletion }: BtnActionsCollectionProps) {


  return (
    <div className="fixed bg-primary-300 p-2 bottom-20 right-1/2 transform translate-x-1/2 flex gap-3 rounded-full z-50">
      <button
        type="button"
        className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 rounded-full text-white shadow-lg transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
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
        <div className="flex flex-col gap-2">
          {collectionsToDelete.size > 0 && (
            <button
              onClick={confirmDeletion}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors font-medium text-sm whitespace-nowrap"
            >
              Confirmar colección
            </button>
          )}

          <button
            onClick={toggleDeleteMode}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-full text-white shadow-lg transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
