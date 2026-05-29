// app/public/sw.js
// Minimal service worker for the Post-Quantum Atlas static export.
// Strategy: stale-while-revalidate for documents + assets; cache-first for fonts and icons.
// Version is bumped to invalidate caches on deploy.

const VERSION = "pq-atlas-v3";
const CACHE_SHELL = `${VERSION}-shell`;
const CACHE_RUNTIME = `${VERSION}-runtime`;

const SHELL_URLS = [
  "/post-quantum-atlas/",
  "/post-quantum-atlas/learn/foundations/",
  "/post-quantum-atlas/atlas/",
  "/post-quantum-atlas/challenges/",
  "/post-quantum-atlas/map/",
  "/post-quantum-atlas/about/",
  "/post-quantum-atlas/icon-192.svg",
  "/post-quantum-atlas/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) =>
      cache.addAll(SHELL_URLS).catch(() => {
        // Don't fail install if a particular URL hiccups; runtime cache will pick it up.
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GETs.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate.
  event.respondWith(
    caches.open(CACHE_RUNTIME).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached); // offline fallback to cache

      return cached || network;
    })
  );
});
