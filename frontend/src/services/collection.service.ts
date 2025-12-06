import { API_CONFIG } from "@/config/api.config"
import { CollectionsAPIResponse, Collection, CreateCollectionRequest, UpdateCollectionRequest } from "@/types/ICollections"


export const collectionService = {

    getAll: async (): Promise<Collection[]> => {
        const url = API_CONFIG.getApiUrl('/colecciones');

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.message ||
                    `Error ${response.status}: ${response.statusText}`
                )
            }

            const result: CollectionsAPIResponse = await response.json()

            return result.data
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },

    getById: async (id: string): Promise<Collection> => {
        const url = API_CONFIG.getApiUrl(`/colecciones/${id}`)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()
            return result.data

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },

    create: async (data: CreateCollectionRequest): Promise<Collection> => {
        const url = API_CONFIG.getApiUrl('/colecciones');
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
                throw new Error(
                    errorData.message ||
                    `Error ${response.status}: ${response.statusText}`
                )
            }

            const result = await response.json()
            return result.data
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },

    update: async (id: number, data: UpdateCollectionRequest): Promise<Collection> => {
        const url = API_CONFIG.getApiUrl(`/colecciones/${id}`)

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const result = await response.json()
            return result.data

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },

    delete: async (id: number): Promise<void> => {
        const url = API_CONFIG.getApiUrl(`/colecciones/${id}`)

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.message ||
                    `Error ${response.status}: ${response.statusText}`
                )
            }

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            throw new Error(errorMessage)
        }
    },
}