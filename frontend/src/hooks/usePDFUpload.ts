import { useState, useCallback, useRef } from 'react';

export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UploadInfo {
  fileName: string;
  fileSize: string;
  progress: number;
  uploadSpeed: string;
}

export function usePDFUpload() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
    fileName: '',
    fileSize: '',
    progress: 0,
    uploadSpeed: '0KB/sec',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleAddMaterial = useCallback(() => {
    console.log('Agregar material personalizado');
    // Aquí puedes agregar la lógica para agregar un material personalizado
  }, []);

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
    const chunkSize = totalSize / 100; // Dividir en 100 partes para el progreso

    setUploadInfo({
      fileName: file.name,
      fileSize: fileSize,
      progress: 0,
      uploadSpeed: '0KB/sec',
    });

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Incremento aleatorio entre 5-20%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simular un pequeño delay antes de mostrar el éxito
        setTimeout(() => {
          // Probabilidad de error del 20% para testing
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
            
            // Aquí puedes llamar a tu API para guardar el archivo
            // await uploadFileToServer(file);
          }
        }, 300);
      } else {
        // Calcular velocidad de carga simulada
        const speed = (chunkSize * (Math.random() * 50 + 100)) / 1024; // KB/sec aleatorio
        
        setUploadInfo((prev) => ({
          ...prev,
          progress: Math.round(progress),
          uploadSpeed: `${Math.round(speed)}KB/sec`,
        }));
      }
    }, 200); // Actualizar cada 200ms
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validar que sea un PDF
    if (file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF');
      return;
    }

    // Validar tamaño máximo (ej: 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máximo 10MB');
      return;
    }

    simulateUpload(file);
    
    // Limpiar el input para permitir subir el mismo archivo de nuevo
    if (event.target) {
      event.target.value = '';
    }
  }, [simulateUpload]);

  const handleUploadPDF = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Resetear después de la animación de cierre
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
      // Crear un nuevo File object para reintentar
      // En producción, deberías guardar el archivo original
      setUploadState('uploading');
      setUploadInfo((prev) => ({
        ...prev,
        progress: 0,
        uploadSpeed: '0KB/sec',
      }));
      
      // Simular reintento
      setTimeout(() => {
        const mockFile = new File([''], uploadInfo.fileName, { type: 'application/pdf' });
        simulateUpload(mockFile);
      }, 500);
    }
  }, [uploadInfo.fileName, simulateUpload]);

  return {
    searchQuery,
    selectedCategory,
    uploadState,
    uploadInfo,
    isModalOpen,
    fileInputRef,
    handleSearch,
    handleCategoryToggle,
    handleAddMaterial,
    handleUploadPDF,
    handleFileSelect,
    handleCloseModal,
    handleRetry,
  };
}