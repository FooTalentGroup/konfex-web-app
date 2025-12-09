export interface LeadForm {
    prenda?: string;
    tipoCliente?: "personal" | "equipo" | null;
    cantidad?: number | null;
    fecha?: string | null;
    diseno?: string | null;
    contacto?: string | null;
  }
  
  export enum LeadStep {
    PRENDA = 1,
    TIPO_CLIENTE = 2,
    CANTIDAD = 3,
    FECHA = 4,
    DISEÑO = 5,
    CONTACTO = 6,
    DONE = 7
  }
  
  export const questions: Record<LeadStep, string> = {
    [LeadStep.PRENDA]: "¡Hola! 👋 Soy Luciana y estoy aquí para ayudarte, ¿qué tipo de prenda deportiva necesitas? (poleras, shorts, buzos, camisetas, set completo, etc.)",
    [LeadStep.TIPO_CLIENTE]: "Perfecto. ¿Es un pedido personal o para un equipo/grupo?",
    [LeadStep.CANTIDAD]: "Genial. ¿Cuántas unidades estás pensando pedir? (puede ser aproximado)",
    [LeadStep.FECHA]: "Entendido. ¿Tienes alguna fecha estimada para recibir el pedido?",
    [LeadStep.DISEÑO]: "¿Tienes algún diseño, referencia o idea? Si no, también puedo ayudarte a crear uno 😊",
    [LeadStep.CONTACTO]: "Por último: si deseas, puedes dejar un número de contacto. Si prefieres, seguimos chateando por aquí 👍",
    [LeadStep.DONE]: "Perfecto, el equipo de ventas se ponga en contacto contigo"
  };
  