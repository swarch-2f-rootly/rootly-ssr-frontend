export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type RequestConfig = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  next?: RequestInit["next"]; // Next.js caching hints
  revalidate?: number; // ISR seconds
};

export class ApiException extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiException";
    this.status = status;
  }
}

export class RootlyApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: config.signal,
      next: config.next,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiException(text || res.statusText, res.status);
    }

    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
  }

  get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>("GET", endpoint, undefined, config);
  }
  post<T>(endpoint: string, data: unknown, config?: RequestConfig) {
    return this.request<T>("POST", endpoint, data, config);
  }
  put<T>(endpoint: string, data: unknown, config?: RequestConfig) {
    return this.request<T>("PUT", endpoint, data, config);
  }
  delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }
}

// Factory: en SSR actuamos como Closed API, por ahora apuntamos a /api del Next server
export const createApiClient = () => new RootlyApiClient("/api");


