import { useState } from 'react';

export const useCategoryDelete = () => {
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
    };

    return {
        isDeleteMode,
        toggleDeleteMode,
    };
};
