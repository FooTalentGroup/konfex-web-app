'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    categoryName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteModal({
    isOpen,
    categoryName,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 mx-4">
                {/* Botón cerrar */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icono de advertencia */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
                    ¿Eliminar categoría?
                </h2>

                {/* Mensaje */}
                <p className="text-center text-gray-600 mb-6">
                    Estás a punto de eliminar la categoría{' '}
                    <span className="font-bold text-gray-900">"{categoryName}"</span>.
                    <br />
                    <br />
                    Esto eliminará todos los materiales asociados a esta categoría.
                </p>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors text-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors text-white"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}