import { apiClient } from "../config/apiClient";
import { useState, useEffect } from "react";

interface NextNumberResponse {
    data: {
    numeroPresupuesto: number;
    };
}

export function useBudgetMetadata() {
    const [metadata, setMetadata] = useState({
        id: '------',
        date: '---'
    });

    useEffect(() => {
        const presupuesto = async () => {
            try {
                const { data } = await apiClient<NextNumberResponse>("/budgets/next-number");
                const formattedId = `P-${new Date().getFullYear()}-${data.numeroPresupuesto.toString().padStart(5, "0")}`;
                const date = new Date().toLocaleDateString();
                setMetadata({ id: formattedId, date });
                
            } catch (error) {
            }
        }
        presupuesto()
    }, []);

    return metadata;
}
