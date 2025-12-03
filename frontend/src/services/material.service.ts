import { API_CONFIG } from "@/config/api.config";
import { MaterialAPIRequest, MaterialAPIResponse } from "@/types/IFabric";

export const materialService = { 
    create: async (data: MaterialAPIRequest): Promise<MaterialAPIResponse> => {
        const url = API_CONFIG.getApiUrl('/materiales');

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