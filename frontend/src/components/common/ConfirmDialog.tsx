'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>

      <div
        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
        onClick={onCancel}
      />


      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
          

          <div className={`px-6 pt-6 pb-4 ${isDangerous ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${isDangerous ? 'bg-red-100' : 'bg-blue-100'}`}>
                <AlertCircle 
                  size={24} 
                  className={isDangerous ? 'text-red-600' : 'text-blue-600'} 
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              </div>
              <button
                onClick={onCancel}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>


          <div className="px-6 py-4">
            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
          </div>


          <div className="h-[1px] bg-gray-200" />


          <div className="px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                isDangerous
                  ? 'bg-red-500 hover:bg-red-600 active:scale-95'
                  : 'bg-[#C071F4] hover:bg-[#ae5ce6] active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
