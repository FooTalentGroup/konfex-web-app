import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';

export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UploadInfo {
    fileName: string;
    fileSize: string;
    progress: number;
    uploadSpeed: string;
}

export function usePDFUpload() {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
        fileName: '',
        fileSize: '',
        progress: 0,
        uploadSpeed: '0KB/sec',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const toast = useToast();

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i].toLowerCase();
    };

    const simulateUpload = useCallback((file: File) => {
        setUploadState('uploading');
        setIsModalOpen(true);

        const fileSize = formatFileSize(file.size);
        let progress = 0;
        const totalSize = file.size;
        const chunkSize = totalSize / 100; 

        setUploadInfo({
            fileName: file.name,
            fileSize: fileSize,
            progress: 0,
            uploadSpeed: '0KB/sec',
        });

        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; 

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setTimeout(() => {

                    const shouldError = Math.random() < 0.2;

                    if (shouldError) {
                        setUploadState('error');
                        setUploadInfo((prev) => ({
                            ...prev,
                            progress: 100,
                            uploadSpeed: '0KB/sec',
                        }));
                    } else {
                        setUploadState('success');
                        setUploadInfo((prev) => ({
                            ...prev,
                            progress: 100,
                            uploadSpeed: '0KB/sec',
                        }));
                    }
                }, 300);
            } else {

                const speed = (chunkSize * (Math.random() * 50 + 100)) / 1024; // KB/sec aleatorio

                setUploadInfo((prev) => ({
                    ...prev,
                    progress: Math.round(progress),
                    uploadSpeed: `${Math.round(speed)}KB/sec`,
                }));
            }
        }, 200); 
    }, []);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.showWarning('Por favor selecciona un archivo PDF');
            return;
        }

        const maxSize = 20 * 1024 * 1024; 
        if (file.size > maxSize) {
            toast.showError('El archivo es demasiado grande. Máximo 20MB');
            return;
        }

        simulateUpload(file);

        if (event.target) {
            event.target.value = '';
        }
    }, [simulateUpload, toast]);

    const handleUploadPDF = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => {
            setUploadState('idle');
            setUploadInfo({
                fileName: '',
                fileSize: '',
                progress: 0,
                uploadSpeed: '0KB/sec',
            });
        }, 300);
    }, []);

    const handleRetry = useCallback(() => {
        if (uploadInfo.fileName) {

            setUploadState('uploading');
            setUploadInfo((prev) => ({
                ...prev,
                progress: 0,
                uploadSpeed: '0KB/sec',
            }));

            setTimeout(() => {
                const mockFile = new File([''], uploadInfo.fileName, { type: 'application/pdf' });
                simulateUpload(mockFile);
            }, 500);
        }
    }, [uploadInfo.fileName, simulateUpload]);

    return {

        uploadState,
        uploadInfo,
        isModalOpen,
        fileInputRef,

        handleUploadPDF,
        handleFileSelect,
        handleCloseModal,
        handleRetry,
    };
}