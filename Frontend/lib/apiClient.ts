// apiClient.ts
import { getToken, getRefreshToken, saveTokens, clearTokens } from "./token";

const BASE_URL = "http://34.228.198.154/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const merged: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, merged);

  // If token expired, try refresh
  if (res.status === 401) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      // retry once with new token
      const retry = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          ...(options.headers || {}),
        },
      });
      if (!retry.ok) throw new Error(`Retry failed: ${retry.statusText}`);
      return retry.json();
    } else {
      clearTokens();
      throw new Error("Session expired, please sign in again.");
    }
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "API error");
  }

  return res.json();
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  saveTokens(data.idToken, data.refreshToken);
  return true;
}
