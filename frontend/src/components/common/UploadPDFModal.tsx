'use client';

import React from 'react';
import { X, FileText, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export type UploadState = 'uploading' | 'success' | 'error';

export interface UploadPDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    state: UploadState;
    fileName?: string;
    fileSize?: string;
    progress?: number;
    uploadSpeed?: string;
    onRetry?: () => void;
}

const UploadPDFModal: React.FC<UploadPDFModalProps> = ({
    isOpen,
    onClose,
    state,
    fileName = 'documento.pdf',
    fileSize = '5.2MB',
    progress = 0,
    uploadSpeed = '140KB/sec',
    onRetry,
}) => {
    if (!isOpen) return null;

    const truncateFileName = (name: string, maxLength: number = 25): string => {
    if (name.length <= maxLength) return name;
    
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return name.slice(0, maxLength - 3) + '...';
    }
    
    const extension = name.slice(lastDotIndex);
    const nameWithoutExt = name.slice(0, lastDotIndex);
    const availableLength = maxLength - extension.length - 3; 
    
    if (availableLength <= 0) {
      return '...' + extension;
    }
    
    return nameWithoutExt.slice(0, availableLength) + '...' + extension;
  };

    const renderContent = () => {
        switch (state) {
            case 'uploading':
                return (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-secondary-600 font-bold text-lg mb-2 sans-serif">
                                Estamos subiendo tus materiales
                            </h2>
                            <p className="text-black text-sm sans-serif">
                                Solo tomará un momento...
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <FileText className="w-5 h-5 text-secondary-500" />
                                    <div className="flex min-w-full justify-between">
                                        <p className="text-sm text-black truncate sans-serif]" title={fileName}>
                                            {truncateFileName(fileName)}
                                        </p>
                                        <p className="text-xs text-gray-500 sans-serif]">
                                            {fileSize}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-secondary-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 sans-serif]">
                                    {progress}% Hecho
                                </span>
                                <span className="text-gray-600 sans-serif]">
                                    {uploadSpeed}
                                </span>
                            </div>
                        </div>
                    </>
                );

            case 'success':
                return (
                    <>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <FileText className="w-16 h-16 text-secondary-500" />
                            </div>
                            <h2 className="text-secondary-600 font-bold text-lg mb-2 sans-serif">
                                ¡Listo! Tu documento
                            </h2>
                            <h2 className="text-secondary-600 font-bold text-lg mb-3 sans-serif">
                                se cargó con éxito.
                            </h2>
                            <p className="text-black text-sm sans-serif">
                                Ahora tus materiales estarán organizados
                            </p>
                            <p className="text-black text-sm sans-serif">
                                por categorías para que los ubiques sin
                            </p>
                            <p className="text-black text-sm sans-serif">
                                complicarte.
                            </p>
                        </div>
                    </>
                );

            case 'error':
                return (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-secondary-600 font-bold text-lg mb-2 sans-serif">
                                Algo salió mal
                            </h2>
                            <h2 className="text-secondary-600 font-bold text-lg mb-3 sans-serif">
                                con la carga
                            </h2>
                            <p className="text-black text-sm sans-serif">
                                Intenta nuevamente
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3 flex-1">
                                    <FileText className="w-5 h-5 text-secondary-500" />
                                    <div className="flex min-w-full justify-between">
                                        <p className="text-sm text-black truncate sans-serif" title={fileName}>
                                            {truncateFileName(fileName)}
                                        </p>
                                        <p className="text-xs text-gray-500 sans-serif">
                                            {fileSize}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="ml-4 mr-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-3">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs text-red-500 sans-serif]">
                                        Error
                                    </span>
                                </div>
                                <button
                                    onClick={onRetry}
                                    className="flex items-center gap-1 text-xs text-secondary-500 hover:text-secondary-600 transition-colors sans-serif"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Intentar
                                </button>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-[#F3F0F5] rounded-2xl p-6 w-full max-w-sm shadow-xl pointer-events-auto transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default UploadPDFModal;