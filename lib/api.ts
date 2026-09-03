const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };
  console.log("api headers", headers);
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
  console.log("response", response.json);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API request failed with status ${response.status}`,
    );
  }

  return response.json();
};
