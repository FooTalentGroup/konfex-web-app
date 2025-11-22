import { useState, useEffect } from "react";

export function useBudgetMetadata() {
    const [metadata, setMetadata] = useState({
        id: '------',
        date: '---'
    });

    useEffect(() => {
        const generateId = () => {
            const randomNum = Math.floor(Math.random() * 100000);
            return randomNum.toString().padStart(6, '0');
        };

        const id = generateId();
        const date = new Date().toLocaleDateString();

        setMetadata({ id, date });
    }, []);

    return metadata;
}
