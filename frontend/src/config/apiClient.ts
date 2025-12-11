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
  const token = localStorage.getItem("token");

  const url = API_CONFIG.getApiUrl(endpoint);

  const config: RequestInit = {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, config);

  if (!res.ok) {
    let errorMessage = res.statusText;

    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      try {
        const errorText = await res.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {}
    }

    throw new Error(errorMessage);
  }

  try {
    return (await res.json()) as TResponse;
  } catch {
    return {} as TResponse;
  }
}
