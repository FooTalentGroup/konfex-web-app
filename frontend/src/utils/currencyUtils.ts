/**
 * Formatea un número como moneda en formato argentino
 * @param amount - Cantidad a formatear
 * @param options - Opciones de formateo
 * @returns Número formateado como string
 */
export const formatCurrency = (
  amount: number | null | undefined,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  if (amount == null || isNaN(amount)) {
    return "0";
  }

  const {
    locale = "es-AR",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};

/**
 * Formatea un número como moneda con símbolo de peso argentino
 * @param amount - Cantidad a formatear
 * @returns Número formateado con símbolo $ como string
 */
export const formatCurrencyWithSymbol = (
  amount: number | null | undefined
): string => {
  return `$ ${formatCurrency(amount)}`;
};
