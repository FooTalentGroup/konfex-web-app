// ai/extractors/leadExtractor.ts
import { runJsonPrompt } from "../runPrompt";

export function buildLeadPrompt(question: string, answer: string, partial: any) {
  return `
Eres un extractor de información de un formulario conversacional.

Dado:
- La pregunta realizada: "${question}"
- La respuesta del usuario: "${answer}"
- Los datos recolectados hasta ahora: ${JSON.stringify(partial)}

Tu tarea:
- Interpretar la respuesta en lenguaje natural.
- Devolver SOLO un JSON válido con el estado actualizado del formulario:

{
  "prenda": string|null,
  "tipoCliente": "personal"|"equipo"|null,
  "cantidad": number|null,
  "fecha": string|null,
  "diseño": string|null,
  "contacto": string|null
}

Reglas:
- Si el usuario no responde la pregunta, mantener el valor anterior.
- Si la respuesta es ambigua, intenta inferir sin inventar.
- NO incluyas nada fuera del JSON.

`;
}

export async function extractLeadField(
  question: string,
  answer: string,
  partial: any
) {
  return runJsonPrompt(buildLeadPrompt(question, answer, partial), (obj): obj is any => true);
}
