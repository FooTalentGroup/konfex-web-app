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
}: BtnActionsCollectionProps) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
      <div className="flex items-center gap-3 bg-[#D4C4DD] px-3 py-2 rounded-full shadow-lg">
        <button
          type="button"
          onClick={onAddCollection}
          className="w-14 h-14 bg-[#9D86AC] hover:bg-[#8B7499] rounded-full flex items-center justify-center text-white shadow-md transition-all"
          title="Descargar PDF"
        >
          <ArrowDownTrayIcon className="w-6 h-6" />
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
    </div>
  );
};

const BtnActionsCollections = {
  default: BtnActionsCollectionDefault,
  fichaMode: BtnActionsCollectionFichaMode,
};

export default BtnActionsCollections;
