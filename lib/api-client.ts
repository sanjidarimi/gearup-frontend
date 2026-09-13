import type { ApiResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: object;
}

function buildQuery(query?: object) {
  if (!query) return "";

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (value === "All") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

// Browser requests go through our own /api route handler, which attaches the
// httpOnly access token before forwarding the call to the GearUp backend.
export async function api<T>(
  endpoint: string,
  { body, query, headers, ...init }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;

  const response = await fetch(`/api${endpoint}${buildQuery(query)}`, {
    ...init,
    headers: {
      ...(body !== undefined && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
    credentials: "same-origin",
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return payload as ApiResponse<T>;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
