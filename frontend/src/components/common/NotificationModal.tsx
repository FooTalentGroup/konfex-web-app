'use client';

import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface NotificationModalProps {
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
}

export default function NotificationModal({
    isOpen,
    type,
    title,
    message,
    onClose,
}: NotificationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 mx-4">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icono */}
                <div className="flex justify-center mb-4">
                    {type === 'success' ? (
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    ) : (
                        <div className="bg-red-100 rounded-full p-3">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                    )}
                </div>

                {/* Título */}
                <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
                    {title}
                </h2>

                {/* Mensaje */}
                <p className="text-center text-gray-600 mb-6">
                    {message}
                </p>

                {/* Botón */}
                <button
                    onClick={onClose}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${type === 'success'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}
