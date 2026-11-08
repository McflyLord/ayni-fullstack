import type { AyniState } from "./types";

// La URL se puede cambiar desde frontend/.env sin modificar el código.
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 204) return null as T;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? body?.error ?? `Error HTTP ${response.status}`;
    throw new Error(message);
  }
  return body as T;
}

// Serializa los guardados para evitar que una petición antigua sobrescriba una nueva.
let saveQueue: Promise<unknown> = Promise.resolve();

export const apiClient = {
  async getState(): Promise<AyniState | null> {
    return request<AyniState | null>("/demo/state");
  },

  saveState(state: AyniState): Promise<unknown> {
    const snapshot = structuredClone(state);
    saveQueue = saveQueue
      .catch(() => undefined)
      .then(() =>
        request("/demo/state", {
          method: "PUT",
          body: JSON.stringify(snapshot),
        }),
      );
    return saveQueue;
  },

  async health(): Promise<{ success: boolean; message: string }> {
    return request("/health");
  },
};
