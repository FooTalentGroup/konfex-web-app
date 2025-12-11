"use client"
import { Plus, Trash2, XCircleIcon } from "lucide-react";

interface BtnActionsCollectionProps {
  collectionsToDelete?: Set<number>;
  isDeleteMode: boolean;
  toggleDeleteMode: () => void;
  confirmDeletion: () => void;
  onAddCollection?: () => void;
}

export default function BtnActionsCollections({ isDeleteMode, toggleDeleteMode, onAddCollection }: BtnActionsCollectionProps) {


  return (
    <div className="fixed bg-primary-200 px-4 py-2 bottom-20 right-1/2 transform translate-x-1/2 flex gap-3 rounded-full z-10">
      <button
        type="button"
        onClick={onAddCollection}
        className="bg-primary-500 hover:bg-secondary-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-lg transition-colors font-medium text-sm flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={toggleDeleteMode}
        className={`w-12 h-12 sm:w-14 sm:h-14 ${!isDeleteMode ? 'bg-primary-500 hover:bg-primary-600' : 'bg-terciary-500 hover:bg-gray-400'} rounded-full flex items-center justify-center text-white shadow-lg transition-colors`}
        title="Modo eliminar"
      >
        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

    </div>
  )
}
