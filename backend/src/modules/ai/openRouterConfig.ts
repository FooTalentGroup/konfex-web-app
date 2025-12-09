import axios from "axios";

export async function callOpenRouter(messages: any[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("No tiene ccceso");

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "tngtech/deepseek-r1t2-chimera:free",
      messages,
      reasoning: { enabled: true }
    },
    {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
    }
  );

  const content: string = response.data?.choices?.[0]?.message?.content ?? "";
  return content.trim();
}
