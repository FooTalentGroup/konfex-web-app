export interface CloudinaryPDFUploadResponse {
    secure_url: string;
    public_id: string;
    format: string;
    bytes: number;
    pages: number;
    resource_type: string;
}

export async function uploadPDFToCloudinary(
    file: File,
    folder = "materials/pdfs/",
    onProgress?: (progress: number, speed: string) => void
): Promise<CloudinaryPDFUploadResponse> {
    const cloudName = "dkedlvr1y";
    const uploadPreset = "konfex-materials-pdf"; 

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing');
    }

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);
        formData.append('resource_type', 'raw'); 

        // XMLHttpRequest para tracking de progreso
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let startTime = Date.now();
            let lastLoaded = 0;

            // Tracking de progreso
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - startTime) / 1000; 
                    const loadedDiff = e.loaded - lastLoaded;
                    const speed = loadedDiff / timeDiff / 1024;
                    
                    onProgress(percentComplete, `${Math.round(speed)}KB/sec`);
                    
                    lastLoaded = e.loaded;
                    startTime = currentTime;
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve({
                            secure_url: data.secure_url,
                            public_id: data.public_id,
                            format: data.format,
                            bytes: data.bytes,
                            pages: data.pages || 0,
                            resource_type: data.resource_type,
                        });
                    } catch (error) {
                        reject(new Error('Error al procesar la respuesta del servidor'));
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(new Error(error.error?.message || 'Error al subir el PDF'));
                    } catch {
                        reject(new Error('Error al subir el PDF'));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Error de red al subir el PDF'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Carga cancelada'));
            });

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`);
            xhr.send(formData);
        });
    } catch (error) {
        console.error('Cloudinary PDF Upload Error:', error);
        throw error;
    }
}

export function validatePDFFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['application/pdf'];
    const maxSize = 10 * 1024 * 1024; 

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'El archivo debe ser un PDF',
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'El PDF no debe superar los 10MB',
        };
    }

    return { valid: true };
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)}${sizes[i].toLowerCase()}`;
}