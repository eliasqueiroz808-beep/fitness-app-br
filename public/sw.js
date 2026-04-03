// Protocolo 5% — Service Worker
const CACHE_NAME = "protocolo5-v1";
const PRECACHE_URLS = ["/", "/dashboard", "/workouts", "/shop", "/profile", "/assistant"];

// Install: pre-cache shell routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Skip non-http(s) requests
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful navigation requests
        if (response.ok && event.request.mode === "navigate") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
