'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (nombre: string) => Promise<boolean>;
}

export default function AddCategoryModal({
    isOpen,
    onClose,
    onConfirm,
}: AddCategoryModalProps) {
    const [nombre, setNombre] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const success = await onConfirm(nombre.trim());

        setIsSubmitting(false);

        if (success) {
            setNombre('');
            onClose();
        } else {
            setError('Error al crear la categoría');
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setNombre('');
            setError('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 mx-4">
                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Título */}
                <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
                    Agregar nueva categoría
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la categoría
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Hilos, Botones, Telas..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !nombre.trim()}
                            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}