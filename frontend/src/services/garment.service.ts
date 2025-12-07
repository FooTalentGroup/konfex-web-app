import { API_CONFIG } from "@/config/api.config";
import { CreateGarmentPayload } from "@/types/IGarment";

export const garmentService = {
    create: async (data: CreateGarmentPayload): Promise<void> => {
        try {
            const response = await fetch(`${API_CONFIG.getApiUrl('/productos')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
    
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                    `Error ${response.status}: ${response.statusText}`
                );
            }

            const result = await response.json();
            return result.data
        } catch (error) {
            throw error;
        }
    } 
}
