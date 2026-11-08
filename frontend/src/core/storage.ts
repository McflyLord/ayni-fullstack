import type { AyniState } from "./types";

const KEY = "ayni.v1.state";
const PENDING_SYNC_KEY = "ayni.v1.pendingSync";

export const storageService = {
  load(fallback: AyniState): AyniState {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
      return fallback;
    }
  },
  save(state: AyniState) {
    localStorage.setItem(KEY, JSON.stringify(state));
    // Si se guarda sin red, el estado local tiene prioridad al reconectar.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      localStorage.setItem(PENDING_SYNC_KEY, "1");
    }
  },
  hasPendingSync() {
    return localStorage.getItem(PENDING_SYNC_KEY) === "1";
  },
  markPendingSync() {
    localStorage.setItem(PENDING_SYNC_KEY, "1");
  },
  clearPendingSync() {
    localStorage.removeItem(PENDING_SYNC_KEY);
  },
  reset() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(PENDING_SYNC_KEY);
    sessionStorage.removeItem("ayni.v1.session");
  },
};
