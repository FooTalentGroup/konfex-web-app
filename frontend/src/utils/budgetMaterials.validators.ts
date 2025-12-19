export const normalizePriceInput = (value: string): string => {
    if (value === "") return "0";
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) return "0";
    return value;
};

export const normalizeQuantity = (value: number): number => {
    if (!value || value < 1) return 1;
    return value;
};

export const validateMaterialName = (value: string): boolean =>
    value.trim().length > 0 && value.length <= 100;
