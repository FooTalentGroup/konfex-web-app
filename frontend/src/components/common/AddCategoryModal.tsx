'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (nombre: string) => Promise<{ success: boolean; error?: string }>;
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

        const result = await onConfirm(nombre.trim());

        if (result.success) {
            setNombre('');
            onClose();
        } else {
            setError(result.error || 'Error al crear la categoría');
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
                className="absolute inset-0 bg-[#00000094]"
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
                <h2 className="text-xl font-bold text-center text-[var(--secondary-color-300)] mb-6">
                    Materia prima
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre de materia prima"
                            className="w-full px-4 py-1 text-[var(--primary-color-300)] text-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !nombre.trim()}
                            className=" py-2 px-2 bg-[var(--secondary-color-500)] text-white rounded-full font-medium transition-colors"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className=" py-2 px-2 bg-[#EAD0FB] text-[#5A0B8E] rounded-full border-[#5A0B8E] border-[1px] font-medium transition-colors"
                        >
                            Cancelar
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}