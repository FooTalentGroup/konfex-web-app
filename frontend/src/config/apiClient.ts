import { API_CONFIG } from "@/config/api.config";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions<TBody> {
  method?: Method;
  body?: TBody;
  headers?: Record<string, string>;
}

export async function apiClient<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  options: ApiOptions<TBody> = {}
): Promise<TResponse> {
  const url = API_CONFIG.getApiUrl(endpoint);

  const config: RequestInit = {
    method: options.method ?? "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${res.status}: ${errorText || res.statusText}`);
  }

  try {
    return (await res.json()) as TResponse;
  } catch {
    return {} as TResponse;
  }
}
