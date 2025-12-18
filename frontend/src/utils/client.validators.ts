
export const normalizeTrim = (value?: string) =>
    typeof value === "string" ? value.trim() : value;

/* =========================
   VALIDACIONES INDIVIDUALES
========================= */

export const validateClientName = (value?: string) => {
    if (!value || value.trim().length === 0) {
        return "El nombre del cliente es obligatorio";
    }
    return true;
};

export const validateEmailOptional = (value?: string) => {
    if (!value) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value)
        ? true
        : "Formato de email no válido";
};

export const validatePhoneOptional = (value?: string) => {
    if (!value) return true;

    const phoneRegex = /^[0-9+\s()-]{6,20}$/;
    return phoneRegex.test(value)
        ? true
        : "Formato de teléfono no válido";
};

/* =========================
   VALIDACIÓN CRUZADA
========================= */

export const validateClientContact = (
    email?: string,
    phone?: string
) => {
    if (!email && !phone) {
        return "Debe ingresar al menos un dato de contacto (email o teléfono)";
    }
    return true;
};
