type FormatType = "short" | "long" | "localized";
/**
 * Formatea una fecha a formato corto DD/MM/YY
 * @param dateString - Fecha en formato string (ISO o similar)
 * @returns Fecha formateada como DD/MM/YY o "00/00/00" si no hay fecha válida
 */
export const formatDate = (
  dateString: string | null | undefined,
  type: FormatType = "long",
  locale: string = "es-AR",
  fallback: string = ""
): string => {
  if (!dateString) return fallback;

  let date: Date;
  try {
    date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error();
  } catch {
    return fallback;
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const yearFull = date.getFullYear();
  const yearShort = yearFull.toString().slice(-2);

  switch (type) {
    case "short":
      return `${day}/${month}/${yearShort}`;
    case "long":
      return `${day}/${month}/${yearFull}`;
    case "localized":
      return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    default:
      return fallback;
  }
};

/**
 * Formatea una fecha a formato corto DD/MM/YY
 * @param dateString - Fecha en formato string (ISO o similar)
 * @returns Fecha formateada como DD/MM/YY o "00/00/00" si no hay fecha válida
 */
export const formatDateShort = (date: string | null | undefined) =>
  formatDate(date, "short", "es-AR", "00/00/00");

/**
 * Formatea una fecha a formato largo DD/MM/YYYY
 * @param dateString - Fecha en formato string (ISO o similar)
 * @returns Fecha formateada como DD/MM/YYYY o cadena vacía si no hay fecha válida
 */
export const formatDateLong = (date: string | null | undefined) =>
  formatDate(date, "long", "es-AR", "");

/**
 * Formatea una fecha usando Intl.DateTimeFormat (formato localizado)
 * @param dateString - Fecha en formato string (ISO o similar)
 * @param locale - Locale para el formato (por defecto 'es-AR')
 * @returns Fecha formateada según el locale o cadena vacía si no hay fecha válida
 */
export const formatDateLocalized = (
  date: string | null | undefined,
  locale: string = "es-AR"
) => formatDate(date, "localized", locale, "");

/**
 * Obtiene la fecha actual formateada en formato DD/MM/YYYY
 * @returns Fecha actual formateada como DD/MM/YYYY
 */
export const getCurrentDateFormatted = () =>
  formatDate(new Date().toISOString(), "long", "es-AR", "");
