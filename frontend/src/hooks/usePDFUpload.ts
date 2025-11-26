import { useState, useCallback, useRef } from 'react';
import { uploadPDFToCloudinary, validatePDFFile, formatFileSize } from '@/services/cloudinaryPDF.service';

export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UploadInfo {
    fileName: string;
    fileSize: string;
    progress: number;
    uploadSpeed: string;
}

interface UsePDFUploadProps {
    onUploadSuccess?: (url: string, publicId: string) => void;
    onUploadError?: (error: string) => void;
}

export function usePDFUpload({ onUploadSuccess, onUploadError }: UsePDFUploadProps = {}) {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
        fileName: '',
        fileSize: '',
        progress: 0,
        uploadSpeed: '0KB/sec',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const currentFileRef = useRef<File | null>(null);

    const uploadFile = useCallback(async (file: File) => {
        setUploadState('uploading');
        setIsModalOpen(true);
        
        const fileSize = formatFileSize(file.size);
        currentFileRef.current = file;

        setUploadInfo({
            fileName: file.name,
            fileSize: fileSize,
            progress: 0,
            uploadSpeed: '0KB/sec',
        });

        try {
            const result = await uploadPDFToCloudinary(
                file,
                'materials/pdfs/',
                (progress, speed) => {
                    setUploadInfo((prev) => ({
                        ...prev,
                        progress,
                        uploadSpeed: speed,
                    }));
                }
            );

            setUploadState('success');
            setUploadInfo((prev) => ({
                ...prev,
                progress: 100,
                uploadSpeed: '0KB/sec',
            }));

            console.log('PDF subido exitosamente:', result);
            onUploadSuccess?.(result.secure_url, result.public_id);

        } catch (error) {
            console.log('%cError al subir PDF: ' + error, 'color: white; background: red;');
            setUploadState('error');
            
            const errorMsg = error instanceof Error 
                ? error.message 
                : 'Error al subir el PDF. Intenta de nuevo.';
            
            onUploadError?.(errorMsg);
        }
    }, [onUploadSuccess, onUploadError]);

    const handleFileSelect = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            
            if (!file) return;

            const validation = validatePDFFile(file);
            if (!validation.valid) {
                alert(validation.error || 'Archivo no válido');
                onUploadError?.(validation.error || 'Archivo no válido');
                return;
            }

            await uploadFile(file);
            
            if (event.target) {
                event.target.value = '';
            }
        },
        [uploadFile, onUploadError]
    );

    const handleUploadPDF = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);

        setTimeout(() => {
            if (uploadState === 'success' || uploadState === 'error') {
                setUploadState('idle');
                setUploadInfo({
                    fileName: '',
                    fileSize: '',
                    progress: 0,
                    uploadSpeed: '0KB/sec',
                });
                currentFileRef.current = null;
            }
        }, 300);
    }, [uploadState]);

    const handleRetry = useCallback(async () => {
        if (currentFileRef.current) {
            await uploadFile(currentFileRef.current);
        }
    }, [uploadFile]);

    const resetUpload = useCallback(() => {
        setUploadState('idle');
        setUploadInfo({
            fileName: '',
            fileSize: '',
            progress: 0,
            uploadSpeed: '0KB/sec',
        });
        setIsModalOpen(false);
        currentFileRef.current = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return {
        uploadState,
        uploadInfo,
        isModalOpen,
        fileInputRef,
        handleFileSelect,
        handleUploadPDF,
        handleCloseModal,
        handleRetry,
        resetUpload,
    };
}