/**
 * Formatea una fecha a formato corto DD/MM/YY
 * @param dateString - Fecha en formato string (ISO o similar)
 * @returns Fecha formateada como DD/MM/YY o "00/00/00" si no hay fecha válida
 */
export const formatDateShort = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "00/00/00";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  } catch {
    return "00/00/00";
  }
};

/**
 * Formatea una fecha a formato largo DD/MM/YYYY
 * @param dateString - Fecha en formato string (ISO o similar)
 * @returns Fecha formateada como DD/MM/YYYY o cadena vacía si no hay fecha válida
 */
export const formatDateLong = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

/**
 * Formatea una fecha usando Intl.DateTimeFormat (formato localizado)
 * @param dateString - Fecha en formato string (ISO o similar)
 * @param locale - Locale para el formato (por defecto 'es-AR')
 * @returns Fecha formateada según el locale o cadena vacía si no hay fecha válida
 */
export const formatDateLocalized = (
  dateString: string | null | undefined,
  locale: string = "es-AR"
): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
};
