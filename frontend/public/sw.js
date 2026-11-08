const CACHE_NAME = "ayni-shell-v3";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon-v2.png", "/ayni-logo-v2.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(APP_SHELL.map(async (url) => {
        try { await cache.add(url); } catch { /* Los recursos opcionales no bloquean la instalación. */ }
      }));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("ayni-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Nunca interceptar escrituras, APIs, otros dominios ni WebSockets.
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put("/", response.clone());
          await cache.put("/index.html", response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match("/")) || (await caches.match("/index.html")) || Response.error();
      }
    })());
    return;
  }

  // En Vite (start.bat) se intenta la red primero para mantener HMR.
  // Si no hay internet, se sirve el último módulo que el navegador descargó.
  const viteResource =
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.includes("__vite");

  if (viteResource) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match(request, { ignoreSearch: true })) || Response.error();
      }
    })());
    return;
  }

  // Recursos propios (JS/CSS/imagenes) se conservan para la siguiente visita offline.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      return Response.error();
    }
  })());
});
