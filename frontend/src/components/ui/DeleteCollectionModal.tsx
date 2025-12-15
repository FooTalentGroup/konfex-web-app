'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DeleteCollectionModalProps {
  isOpen: boolean;
  collectionsToDelete: Array<{ id: number; nombre: string }>;
  onConfirm: () => void;
  onCancel: () => void;
  toggleDeleteMode: () => void;
  isDeleting?: boolean;
}

const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  isOpen,
  collectionsToDelete,
  onConfirm,
  onCancel,
  toggleDeleteMode,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const isSingle = collectionsToDelete.length === 1;
  const collectionNames = collectionsToDelete.map(c => c.nombre).join(', ');

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onCancel}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#CB2759]" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-[#CB2759] mb-2">
            ¿Estás seguro de eliminar {isSingle ? 'esta colección' : 'estas colecciones'}?
          </h3>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 text-center">
              Vas a eliminar {isSingle ? 'una colección de' : 'las colecciones de'}{' '}
              <span className="font-bold text-red-600">{`"${collectionNames}"`}</span>.
              <br />
              <br />
              Esta acción no se puede deshacer y podrías afectar los presupuestos que la utilizan.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-full bg-secondary-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Eliminando...' : 'Aceptar'}
            </button>

            <button
              onClick={() => {
                onCancel();
                toggleDeleteMode();
              }}
              disabled={isDeleting}
              className="w-full bg-[#EAD0FB] hover:bg-gray-300 text-secondary-500 font-semibold py-3 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteCollectionModal;