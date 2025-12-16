import { API_CONFIG } from "@/config/api.config";
import { MaterialAPIRequest, MaterialAPIResponse, Material } from "@/types/IFabric";

export const materialService = { 
    getAll: async (): Promise<Material[]> => {
        const url = API_CONFIG.getApiUrl('/materials')

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
            }

            const result = await response.json();
            return result.data?.data || result.data || [];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },

    create: async (data: MaterialAPIRequest): Promise<MaterialAPIResponse> => {
        const url = API_CONFIG.getApiUrl('/materials');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
            }

            return await response.json()
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    
    }
}
