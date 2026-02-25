const BASE_URL = "https://api.manychat.com";

export class ManyChatClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, unknown>,
    body?: Record<string, unknown>
  ): Promise<T> {
    let url = `${BASE_URL}${path}`;

    if (params && method === "GET") {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const init: RequestInit = { method, headers };
    if (body && method === "POST") {
      init.body = JSON.stringify(body);
    }

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const response = await fetch(url, init);

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitMs = retryAfter ? parseFloat(retryAfter) * 1000 : 1000 * (attempts + 1);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        attempts++;
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        let detail = text;
        try {
          const json = JSON.parse(text);
          detail = json.message ?? json.error ?? text;
        } catch {
          // use raw text
        }
        throw new ManyChatApiError(response.status, detail);
      }

      const json = (await response.json()) as { status: string; data: T };
      if (json.status === "error") {
        throw new ManyChatApiError(400, JSON.stringify(json));
      }
      return json.data;
    }

    throw new ManyChatApiError(429, "Rate limit exceeded after retries");
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, params);
  }

  async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>("POST", path, undefined, body);
  }
}

export class ManyChatApiError extends Error {
  status: number;
  constructor(status: number, detail: string) {
    super(`ManyChat API error ${status}: ${detail}`);
    this.status = status;
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ManyChatApiError) {
    switch (error.status) {
      case 400:
        return `Error: Bad request. ${error.message}`;
      case 401:
        return "Error: Unauthorized. Check your ManyChat API token.";
      case 403:
        return "Error: Forbidden. Your token may lack the required scope.";
      case 404:
        return "Error: Resource not found.";
      case 429:
        return "Error: Rate limit exceeded. ManyChat allows 10 req/sec. Try again shortly.";
      default:
        return error.message;
    }
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
