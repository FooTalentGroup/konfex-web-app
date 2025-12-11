'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    cancelText: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteModal({
    isOpen,
    title,
    message,
    cancelText,
    confirmText,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-[#0000004f]"
                onClick={onCancel}
            />
            <div className="relative bg-[#FEFCFF] rounded-2xl shadow-2xl w-[90%] max-w-md p-4 mx-4">
                <div className="flex justify-center mb-4 mt-8">
                    <div className="bg-[#FDCEDC] rounded-full p-1">
                        <AlertCircle size={24} className="text-[#C40841]" />
                    </div>
                </div>
                <h2 className="text-lg font-bold text-center text-[#c40841] mb-4 px-2 leading-snug">
                    {title}
                </h2>
                <p className="text-center text-gray-600 mb-6 leading-tight">
                    {message}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onCancel}
                        className="w-full py-3 px-4 bg-[var(--secondary-color-500)] rounded-4xl font-medium transition-colors text-[#FEFCFF]"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full py-3 px-4 bg-[var(--primary-color-200)] rounded-4xl font-medium transition-colors text-[#5A0B8E]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
