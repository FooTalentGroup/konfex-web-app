import { API_CONFIG } from "@/config/api.config";
import { CreateGarmentPayload } from "@/types/IGarment";

export const garmentService = {
    create: async (data: CreateGarmentPayload): Promise<void> => {
        const response = await fetch(`${API_CONFIG.getApiUrl('/garments')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),

        });

        if (!response.ok) {
            console.warn('⚠️ Backend respondió con error (esperado mientras se adapta):', response.status);
        } else {
            console.log('✅ Request enviado exitosamente al backend');
        }
    }
}
