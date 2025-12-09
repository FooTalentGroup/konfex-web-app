import { callOpenRouter } from "./openRouterConfig";

export async function runJsonPrompt<T>(
    prompt: string,
    validator: (obj: unknown) => obj is T
  ): Promise<T> {
  
    const raw = await callOpenRouter([{ role: "user", content: prompt }]);
  
    const cleaned = raw.replace(/```json|```/g, "").trim();
  
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      throw new Error("Error parseando JSON del modelo: " + cleaned);
    }
  
    if (!validator(parsed)) {
      throw new Error("JSON no coincide con el schema esperado");
    }
  
    return parsed;
  }
  