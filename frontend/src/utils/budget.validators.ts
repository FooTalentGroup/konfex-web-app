// src/utils/budget.validators.ts

export const normalizeTrim = (value: unknown) =>
    typeof value === "string" ? value.trim() : value;

/* =========================
   Title
========================= */
export function validateBudgetTitle(value: string) {
    if (!value || value.trim().length === 0) {
        return "El título es obligatorio";
    }

    if (value.length > 200) {
        return "El título no puede exceder 200 caracteres";
    }

    return true;
}

/* =========================
   Client name
========================= */
export function validateClientName(value: string) {
    if (!value || value.trim().length === 0) {
        return "El nombre del cliente es obligatorio";
    }

    if (value.length > 100) {
        return "El nombre no puede exceder 100 caracteres";
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
        return "El nombre solo puede contener letras y espacios";
    }

    return true;
}

/* =========================
   Email
========================= */
export function validateEmailOptional(value?: string) {
    if (!value) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || "Ingresá un email válido";
}

/* =========================
   Phone 
========================= */
export function validatePhoneOptional(value?: string) {
    if (!value) return true;

    if (value.length > 16) {
        return "El teléfono no puede exceder 16 caracteres";
    }

    if (!/^[0-9\-\s\+\(\)]+$/.test(value)) {
        return "El teléfono contiene caracteres inválidos";
    }

    return true;
}

/* =========================
   Contact rule
========================= */
export function validateClientContact(
    email?: string,
    phone?: string
) {
    if (!email && !phone) {
        return "Debe ingresarse email o teléfono";
    }

    return true;
}

/* =========================
   Desired profit
========================= */
export function validateDesiredProfit(value?: number) {
    if (value === undefined || value === null) return true;

    if (value < 0) {
        return "La ganancia no puede ser negativa";
    }

    if (value > 100) {
        return "La ganancia no puede superar el 100%";
    }

    return true;
}

export const validatePositiveNumber = (value: unknown) => {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
        return "Debe ser un número mayor o igual a 0";
    }
    return true;
};

export const validateQuantity = (value: unknown) => {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 1 || num > 9999) {
        return "La cantidad debe estar entre 1 y 9999";
    }
    return true;
};

export const validateExtraName = (value?: string) => {
    if (!value || !value.trim()) {
        return "El nombre del extra es requerido";
    }
    if (value.length > 100) {
        return "El nombre no puede exceder 100 caracteres";
    }
    return true;
};

export const validateObservations = (value?: string) => {
    if (value && value.length > 500) {
        return "Las observaciones no pueden exceder 500 caracteres";
    }
    return true;
};