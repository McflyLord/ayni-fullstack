import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSeed } from "./seed";
import { apiClient } from "./api";
import { storageService } from "./storage";
import type { AyniState } from "./types";

type Store = {
  state: AyniState;
  navigate: (route: string) => void;
  update: (recipe: (draft: AyniState) => void, toast?: string) => void;
  loginDemo: () => void;
  logout: () => void;
  reset: () => void;
  clearToast: () => void;
};

const StoreContext = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => {
    const seeded = storageService.load(createSeed());
    seeded.route = window.location.pathname;
    return seeded;
  });
  const [apiHydrated, setApiHydrated] = useState(false);

  // Al iniciar, intenta recuperar desde MySQL el estado guardado por el backend.
  // Si la API no está disponible, AYNI continúa funcionando con LocalStorage.
  useEffect(() => {
    let active = true;
    apiClient
      .getState()
      .then((remoteState) => {
        if (!active || !remoteState) return;
        // Si hubo cambios offline, el estado local es más reciente y no debe
        // ser reemplazado por una copia antigua del servidor.
        if (storageService.hasPendingSync()) return;
        setState({ ...remoteState, route: window.location.pathname, toast: undefined });
      })
      .catch((error) => {
        console.warn("No se pudo recuperar el estado desde la API AYNI. Se usará LocalStorage.", error);
      })
      .finally(() => {
        if (active) setApiHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!apiHydrated) return;
    storageService.save(state);
    // Guarda en el backend todas las interacciones de los módulos del frontend.
    apiClient.saveState(state).then(() => {
      storageService.clearPendingSync();
    }).catch((error) => {
      storageService.markPendingSync();
      console.warn("No se pudo guardar en la API AYNI. Los cambios siguen en LocalStorage.", error);
    });
    document.documentElement.classList.toggle("large-text", state.settings.largeText);
    document.documentElement.classList.toggle("high-contrast", state.settings.highContrast);
    document.documentElement.classList.toggle("reduce-motion", state.settings.reducedMotion);
  }, [state, apiHydrated]);

  useEffect(() => {
    const retryPendingSync = () => {
      if (!storageService.hasPendingSync()) return;
      // Fuerza un nuevo guardado del estado local al recuperar conexión.
      setState((current) => ({ ...current }));
    };
    window.addEventListener("online", retryPendingSync);
    return () => window.removeEventListener("online", retryPendingSync);
  }, []);

  useEffect(() => {
    const onPop = () => setState((s) => ({ ...s, route: window.location.pathname }));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo<Store>(
    () => ({
      state,
      navigate(route) {
        window.history.pushState({}, "", route);
        window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? "auto" : "smooth" });
        setState((s) => ({ ...s, route }));
      },
      update(recipe, toast) {
        // Protege los cambios locales frente a una respuesta inicial tardía del servidor.
        storageService.markPendingSync();
        setState((current) => {
          const draft = structuredClone(current);
          recipe(draft);
          if (toast) draft.toast = toast;
          return draft;
        });
      },
      loginDemo() {
        setState((s) => ({
          ...s,
          session: true,
          route: s.welcomed ? "/app/inicio" : "/bienvenida",
        }));
        const route = state.welcomed ? "/app/inicio" : "/bienvenida";
        window.history.pushState({}, "", route);
      },
      logout() {
        sessionStorage.removeItem("ayni.v1.session");
        window.history.pushState({}, "", "/");
        setState((s) => ({ ...s, session: false, route: "/" }));
      },
      reset() {
        storageService.reset();
        const fresh = createSeed();
        fresh.session = true;
        fresh.welcomed = true;
        fresh.route = "/app/inicio";
        window.history.pushState({}, "", fresh.route);
        setState({ ...fresh, toast: "Datos de demostración restablecidos" });
      },
      clearToast() {
        setState((s) => ({ ...s, toast: undefined }));
      },
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore debe usarse dentro de StoreProvider");
  return store;
}

export function addMovement(
  state: AyniState,
  type: AyniState["movements"][number]["type"],
  label: string,
  points: number,
) {
  state.movements.unshift({ id: uid(), type, label, points, createdAt: new Date().toISOString() });
  state.user.points += points;
  if (points > 0) state.user.totalEarned += points;
}

export function addNotification(
  state: AyniState,
  title: string,
  body: string,
  route: string,
  type = "comunidad",
) {
  state.notifications.unshift({
    id: uid(),
    title,
    body,
    route,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  });
}
